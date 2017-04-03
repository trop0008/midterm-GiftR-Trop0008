/*****************************************************************
File: index.js
Author: Marjan Tropper
Description:

The RemindR app.
- add a local notification;

- list saved local notifications;

- delete an existing local notification.

Each local notification needs:

1- An id
2- A title
3- A text message
4- A specific time and date
5- An icon    


Version: 0.1.1
Updated: Mar 8, 2017


   
*****************************************************************/
var app = {
    localNote: null,
    init: function () {
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
        app.localNote = cordova.plugins.notification.local;
        app.localNote.on("click", function (notification) {
            alert(notification.title + "\n" + notification.text);

            /* this section is to update the pages once the user clicks on the alert and the notification gets delete */
            let contentDiv = document.querySelector(".content");
            let id = contentDiv.id;
            switch (id) {
            case "page-notify":
                app.showList();

                break;
            case "page-add":
                document.getElementById("add-success").style.display = "none";
                break;
            default:
                //do the home page thing
            }





        });
        //show the list when loading
        app.showList();
    },
    pageChanged: function () {
        //user has clicked a link in the tab menu and new page loaded
        //check to see which page and then call the appropriate function
        let contentDiv = document.querySelector(".content");
        let id = contentDiv.id;
        switch (id) {
        case "page-notify":
            app.showList();

            break;
        case "page-add":
            document.getElementById("btnAdd").addEventListener("click", app.saveNew);

            break;
        default:
            //do the home page thing
        }


    },
    showList: function () {


        app.localNote.getAllIds(function (ids) {
            //check to see if there are any saved notifications
            if (ids.length == 0) {
                document.getElementById("list-error").innerHTML = "You don't have any alerts saved!";
                document.getElementById("list-error").style.display = "block";
                document.getElementById('list-notify').innerHTML = "";

            } else {
                let idCounter = ids.length;
                let alertList = document.getElementById('page-notify');

                let ul = document.getElementById('list-notify');
                ul.innerHTML = "";
                document.getElementById('list-notify').innerHTML = "";
                document.getElementById("list-error").style.display = "none";



                ul.className = "table-view";
                // the saved list items are created here

                ids.forEach(function (id) {
                    app.localNote.get(id, function (note) {
                        // build a list item for one notification

                        let li = document.createElement("li");
                        li.className = "table-view-cell ";
                        let span = document.createElement("span");
                        span.className = "media-object pull-left icon icon-trash";

                        let div = document.createElement("div");
                        div.className = "media-body ";

                        div.innerHTML = note.title + "<br> @ " + moment(note.time).format('MMM Do YYYY, h:mm:ss a');


                        li.appendChild(span);

                        li.appendChild(div);
                        ul.appendChild(li);
                        span.addEventListener("click", deleteAlert)

                        function deleteAlert(ev) {
                            ev.preventDefault;
                            ev.target.removeEventListener("click", deleteAlert);
                            app.localNote.cancel(note.id, function () {
                                // Notification was cancelled


                            });
                            li.parentElement.removeChild(li);
                            idCounter--;
                            if (idCounter == 0) {
                                document.getElementById("add-error").innerHTML = "You don't have any alerts saved!";
                                document.getElementById("add-error").style.display = "block";

                            }

                        }




                    });


                });


            }
        });
    },
    saveNew: function (ev) {
        ev.preventDefault();
        //create a new notification with the details from the form
        let alertDate = document.getElementById("time").value;
        let alertText = document.getElementById("msg").value;
        let alertTitle = document.getElementById("title").value;

        console.log(alertDate);
        let convertDate = new Date(alertDate);
        let alertEpoch = convertDate.getTime() / 1000.0;
        if (alertDate && alertTitle && alertText) {
            app.localNote.schedule({
                id: Date.now(),
                title: alertTitle,
                text: alertText,
                at: alertEpoch,
                icon: 'icon',
                smallIcon: 'small'
            });
            document.getElementById("title").value = "";
            document.getElementById("msg").value = "";
            document.getElementById("time").value = "";
            document.getElementById("add-success").innerHTML = "Alert has been created!";
            document.getElementById("add-error").innerHTML = "";
            document.getElementById("add-error").style.display = "none";
            document.getElementById("add-success").style.display = "block";

        } else {
            document.getElementById("add-error").innerHTML = "Please enter title, text and time!";
            document.getElementById("add-success").innerHTML = "";
            document.getElementById("add-success").style.display = "none";
            document.getElementById("add-error").style.display = "block";
        }



    }
};

app.init();