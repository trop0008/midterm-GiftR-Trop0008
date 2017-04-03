/*****************************************************************
File: index.js
Author: Marjan Tropper
Description:

The GiftR app.


Version: 0.1.1
Updated: Mar 30, 2017


   
*****************************************************************/
/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict";
var app = {
    
    profileId: [],

    savedListProfiles: {
        people: []
    },

    
    initialize: function () {
        try {
            document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
        } catch (e) {
            document.addEventListener('DOMContentLoaded', this.onDeviceReady.bind(this), false);
            console.log('failed to find deviceready');
        }
    },
    onDeviceReady: function () {
        //set up event listeners and default variable values
        window.addEventListener('push', app.pageChanged);
        //cordova.plugins.notification.local

        //show the list when loading
        app.pageChanged();
    },
    pageChanged: function () {
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function
        let EditFlag = false;
        let currentPerson = null;
        let contentDiv = document.querySelector(".content");
        let pageId = contentDiv.id;
        switch (pageId) {
        case "birthdayList":
            // app.showList();

            
            document.getElementById("cancelAddPerson").addEventListener("click", cancelModal);
            document.getElementById("saveAddPerson").addEventListener("click", saveModal);
            getLocalStorage();
                listProfiles();


            break;
        case "giftList":
            console.log("gift");
            document.getElementById("cancelAddGift").addEventListener("click", cancelModal);
            break;
        default:
            //do the home page thing
        }

        function cancelModal(ev) {
            ev.preventDefault;
            let clickedLink = ev.target.id;
            let activeModal;


            switch (pageId) {
            case "birthdayList":
                activeModal = document.getElementById("personModal");
                activeModal.classList.remove('active');
                break;
            case "giftList":
                activeModal = document.getElementById("giftModal");
                activeModal.classList.remove('active');
                break;
            default:
                // if nothing matches do nothing
            }


        }

        function showModal() {
            let activeModal;


            switch (pageId) {
            case "birthdayList":
                activeModal = document.getElementById("personModal");
                activeModal.classList.add('active');
                break;
            case "giftList":
                activeModal = document.getElementById("giftModal");
                activeModal.classList.add('active');
                break;
            default:
                // if nothing matches do nothing
            }


        }
        
        function saveModal() {
            let activeModal;


            switch (pageId) {
            case "birthdayList":
                    let contactName=document.getElementById("contactName").value;
                   // let doBirth=moment(document.getElementById("doBirth").value).format("MMMM Do");
                     let doBirth=document.getElementById("doBirth").value
                 // console.log("date of birth");
                   // console.log(document.getElementById("doBirth").value);
                 
                if (EditFlag){
                    let indexcheck = app.savedListProfiles.people.map(function(e) { return e.id; }).indexOf(currentPerson.id);
                    console.log(indexcheck);
                    app.savedListProfiles.people[indexcheck].name  = contactName;
                    app.savedListProfiles.people[indexcheck].dob = doBirth;
                    app.savedListProfiles.people.sort(function (a,b) {
                
                return (moment(a.dob,"YYYY-MM-DD").format("MM-DD") > moment(b.dob,"YYYY-MM-DD").format("MM-DD")) ? 1 :
                       (moment(a.dob,"YYYY-MM-DD").format("MM-DD") < moment(b.dob,"YYYY-MM-DD").format("MM-DD")) ? -1 : 0;
            });
                   // console.log(app.savedListProfiles);
                    
                } else {
                    let id= Date.now();
                    let profile = {"id":id, "name":contactName, "dob":doBirth, "ideas":[]}
                    app.savedListProfiles.people.push(profile);
                    if (app.savedListProfiles.people.length > 1){
            app.savedListProfiles.people.sort(function (a,b) {
                
                return (moment(a.dob,"YYYY-MM-DD").format("MM-DD") > moment(b.dob,"YYYY-MM-DD").format("MM-DD")) ? 1 :
                       (moment(a.dob,"YYYY-MM-DD").format("MM-DD") < moment(b.dob,"YYYY-MM-DD").format("MM-DD")) ? -1 : 0;
            });
        }
                }
        
         // console.log(app.savedListProfiles);
                    
        setLocalStorage();    
             listProfiles();       
                    
                 EditFlag=false;   
                    currentPerson=null;
                    document.getElementById("contactName").value = "";                
                    document.getElementById("doBirth").value= "";
                    
                    document.getElementById("headertitle").innerHTML= "Add Person";
                activeModal = document.getElementById("personModal");
                activeModal.classList.remove('active');
                break;
            case "giftList":
                activeModal = document.getElementById("giftModal");
                activeModal.classList.add('active');
                break;
            default:
                // if nothing matches do nothing
            }


        }


        /**************************** local storage functions ********************************/
        function setLocalStorage() {
            if (localStorage) {
                localStorage.setItem("giftr-trop0008", JSON.stringify(app.savedListProfiles));
            }
        }





        function getLocalStorage() {
            if (!localStorage.getItem("giftr-trop0008")) {
                // nothing is registered so automatically open the add modal

                showModal();

            } else {
                app.savedListProfiles = JSON.parse(localStorage.getItem('giftr-trop0008'));
                
            }
        }
        
        /********************* list profiles ********************/
        
        function listProfiles(){
                        let profileList = document.getElementById('birthdayList');
                             profileList.innerHTML = "";
                            let header = document.createElement("h3");
            
                    if (app.savedListProfiles.people != null) {
                        if (app.savedListProfiles.people.length == 0) {
                            header.innerHTML="You do not have any contacts listed. Please use the Add Person button on the top left corner to create a contact. "
                        } else {
                            
                            header.innerHTML="Contacts lists:"
                             
                             /*
                                <li class="table-view-cell">
                    <span class="name"><a href="#personModal">Bob Smith</a></span> 
                    
                    <a class="navigate-right pull-right" href="gifts.html"> 
                      <span class="dob">March 10</span>
                    </a>
                </li>
                             */
                          
                             
                             let ul = document.createElement("ul");
                             ul.className = "table-view";
                             app.savedListProfiles.people.forEach(function (person, index) {
                                 // the saved list items are created here
                                 let li = document.createElement("li");
                                 li.className = "table-view-cell ";
                                 let span = document.createElement("span");
                                 span.className = "name";
                                  let linkEdit = document.createElement("a");
                                 linkEdit.href="#personModal";
                                 linkEdit.innerHTML=person.name;
                                 let linkideas = document.createElement("a");
                                 linkideas.href="gifts.html";
                                 linkideas.className = "navigate-right pull-right";
                                 
                                 let span2 = document.createElement("span");
                                 span2.className = "dob";
                                 span2.innerHTML= moment(person.dob).format("MMMM Do");
                                 linkideas.appendChild(span2);
                                 span.appendChild(linkEdit);
                                 
                                 //console.log("the two dates:")
                                 let today =  moment().format("MMMM Do");
                                 let birdaydate =moment(person.dob).format("MMMM Do") ;
                                 if((moment(birdaydate,"MMMM Do")-moment(today,"MMMM Do"))<0){
                                        li.classList.add("pastdate");
                                    }
                                 
                                 li.appendChild(span);
                                 li.appendChild(linkideas);
                                 
                                  
                                 ul.appendChild(li);
                                 linkEdit.addEventListener("touchstart", editProfile);
                                 linkideas.addEventListener("touchstart", viewGifts);
                                 
                                 function editProfile(ev) {
                                     ev.preventDefault;
                                     EditFlag=true;
                                     currentPerson= person;
                                     //console.log(person);
                                     document.getElementById("contactName").value = person.name;
                                    
                                     document.getElementById("doBirth").value= person.dob;
                                     
                                     document.getElementById("headertitle").innerHTML= "Edit Person";
                                     
                                 }
                                 function viewGifts(ev) {
                                     ev.preventDefault;
                                     
                                     currentPerson= person;
                                     console.log(person);
                                     
                                     
                                 }
                             });
                             profileList.appendChild(ul);
                        }
                    } else {
                        showModal();
                    }
                }
            
        }

    



};

/*  /^http(s)?:\/\//   */

app.initialize();