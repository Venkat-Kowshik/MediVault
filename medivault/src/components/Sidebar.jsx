import { useEffect, useState } from "react";
import Sidebtn from "./Sidebtn";
export default function Sidebar(props){

    const [username,setUserName] = useState('')

    function accessAI(){
      window.location.href='https://emergify.pages.dev/first-aid'
    }

    const getusername = async () => {
      try {
        let username=localStorage.getItem('username')
        const response = await fetch(`http://127.0.0.1:8000/getname?username=${encodeURIComponent(username)}`, {
          method: 'GET',
          mode: 'cors',
        });

        let body =await response.json();
        if (response.ok) {
          setUserName(body)
        }

      } catch (error) {
        console.error( error);
      }
    }

    useEffect(()=>{
      getusername()
    },[])
    return (
      <>
        <div className="sidebar">
          <div id="heading">MediVault</div>
          <div className="side-btn" onClick={()=>{props.onNewEntry(true);props.onAddEntry(true)}}>New Entry</div>
          <hr />
          <div id="projects">
          {props.data.map(item=>{

                return (
                    <Sidebtn onClick={()=>{props.onViewPdf(item)}} name={item} key={Math.random()}/>
                )
            })
            }

          </div>
          {props.isDoctor ? (
              <div id="userbtn">
              Hello, Dr. {localStorage.getItem('doctorname')}
            </div>
          ) : (
            <div id="userbtn" style={{display: "flex",flexDirection: 'column'}}>
              Logged in as {username}
              <button type="button" onClick={accessAI}>Access Emergency AI</button>
            </div>
          )}
          
        </div>
      </>
    );
}