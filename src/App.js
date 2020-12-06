import logo from './logo.svg';
import './App.css';
import React from "react";
import ReactDOM from "react-dom";
import fetchJsonp from "fetch-jsonp";

let keys,gotData;
// let url="https://en.wikipedia.org/w/api.php?format=json&action=opensearch&prop=extracts&search=";
let url = 'https://en.wikipedia.org/w/api.php?format=json&action=query&generator=search&gsrnamespace=0&gsrlimit=10&prop=pageimages|extracts&pilimit=max&exintro&explaintext&exsentences=1&exlimit=max&gsrsearch=';
let postUrl = 'https://en.wikipedia.org/?curid='

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      search: false,
      link: []
    }
    this.searchPage = this.searchPage.bind(this);
    this.wikiStore = this.wikiStore.bind(this);
  }
  wikiStore(){
    var links = [];
    console.log(typeof keys);
    for(var i=0;i<keys.length;i++){
      var link={
        txt: gotData.pages[keys[i]].extract,
        heading: gotData.pages[keys[i]].title,
        pageId: gotData.pages[keys[i]].pageid
      }
      links.push(link);
    }
    this.setState(()=>({
      link: links
    }));
  }



  searchPage(){
    if(!this.state.search){
      document.getElementById("search").classList.add("hidden");
      document.getElementById("search-bar").classList.remove("hidden");

      document.getElementById("search-txt").addEventListener("keyup",(event)=>{
        if(event.keyCode === 13 && event.target.value !== ""){
          document.getElementById("App").style.top=0;
          document.getElementById("info").classList.add("hidden");
          fetchJsonp(url+event.target.value)
            .then(response => response.json())
            .then(data =>{
              gotData = data.query;
              keys  = Object.keys(data.query.pages);
              this.wikiStore();
            });
        }
      });
    }else{
      document.getElementById("search").classList.remove("hidden");
      document.getElementById("search-bar").classList.add("hidden");
      document.getElementById("info").classList.remove("hidden");
      document.getElementById("App").style.top="200px";
      gotData ={};
      keys={};
      this.wikiStore();
    }

    this.setState((state)=>({
      search: !state.search
    }));

  }
  render(){
    return(
      <div id="App">
        <a href="https://en.wikipedia.org/wiki/Special:Random" target="_blank"><p className="txt">Click here for a random article</p></a>
        <br />
        <div id="search-bar"className= "hidden">
          <input type="search" id="search-txt" />
          <button className="search-btn btn btn-default" onClick={this.searchPage}><i className="fas fa-times" /></button>
        </div>
        <button className="btn btn-default" id="search" onClick={this.searchPage}><i className="fas fa-search" /></button>
        <br />
        <p className="txt" id="info">Click icon to search</p>
        <Display links={this.state.link} />
      </div>
    );
  }
}

class Display extends React.Component{
  constructor(props){
    super(props);
  }

  render(){
    var lists=[];
    var data = this.props.links;
    for(var i=0;i<data.length;i++){
      var hrefUrl = postUrl+this.props.links[i].pageId;
      lists.push(<a href={hrefUrl} key={this.props.links[i].pageId} target="_blank">
        <div className="wiki-div">
            <h3 className="">{this.props.links[i].heading}</h3>
            <p>{this.props.links[i].txt}</p>
        </div>
      </a>);
    }
    return(
      <div id="display">
      {lists}
      </div>
    )
  }
}

export default App;
