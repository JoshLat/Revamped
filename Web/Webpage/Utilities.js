var debug = new Boolean(false);

class JSONgetter {

  constructor(team, data) {
    this.team = team;
    this.data = data;
    this.json = null;
  }

  loadJSON(callback) {
    var xobj = new XMLHttpRequest();
    xobj.overrideMimeType("application/json");
    xobj.open('GET', '../WebResources/settings.json', false);
    xobj.setRequestHeader("Cache-Control", "no-cache");
    xobj.setRequestHeader("Pragma", "no-cache");
    xobj.setRequestHeader("If-Modified-Since", "Sat, 1 Jan 2000 00:00:00 GMT");
    xobj.onreadystatechange = function() {
      if (xobj.readyState == 4 && xobj.status == "200") {
        callback(xobj.responseText);
      }
    };
    xobj.send(null);
  }

  GetJSON() {
    var json;
    this.loadJSON(function(response) {
      json = JSON.parse(response);
    });

    if (debug == true) {
      console.log(json);
    }
    if (this.data == "motd") {
      return json.motd;
    }
    if (this.data == "notes1") {
      return json.notes1;
    }
    if (this.data == "notes2") {
      return json.notes2;
    }
    if (this.team == "oemmarketing") {
      if (this.data == "task") {
        return json.teams.oemmarketing.tasks;
      }
      if (this.data == "due") {
        return json.teams.oemmarketing.due;
      }
    }
    if (this.team == "techsupport") {
      if (this.data == "task") {
        return json.teams.techsupport.task;
      }
      if (this.data == "due") {
        return json.teams.techsupport.due;
      }
    }
    if (this.team == "webprogramming") {
      if (this.data == "task") {
        return json.teams.webprogramming.task;
      }
      if (this.data == "due") {
        return json.teams.webprogramming.due;
      }
    }
    if (this.team == "everyone") {
      if (this.data == "task") {
        return json.teams.everyone.task;
      }
      if (this.data == "due") {
        return json.teams.everyone.due;
      }
    }
  }

}




class TimeDate {

  constructor(option) {
    this.option = option;
  }

  getFormattedData() {
    if (this.option == "date") {
      return this.FormatOption([
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
      ], this.option);
    } else {
      return this.FormatOption("NULL", this.option);
    }
  }

  FormatOption(data, option) {
    if (option == "date") {
      setInterval(function() {
        document.getElementById("dateid").innerHTML = String(data[(new Date().getMonth())] + " " + new Date().getDate() + ", " + new Date().getFullYear());
      }, 0);
    } else {
      setInterval(function() {
        document.getElementById("timeid").innerHTML = new Date().toLocaleTimeString().replace(/:\d+ /, ' ')
      }, 0);
    }
  }

}




class TaskDueMOTDNotes {

  constructor(team, option, id) {
    this.team = team;
    this.option = option;
    this.id = id;
  }

  GetTask() {
    var getter = new JSONgetter(this.team, this.option);
    const id = this.id;
    var iterations = 0;
    setInterval(function() {
      var json = getter.GetJSON();
      for (var task in json) {
        if (json[task].valueOf() != "") {
          iterations++;
          document.getElementById(id.concat(iterations.toString())).style.display = "inline-block";
          document.getElementById(id.concat(iterations.toString())).innerHTML = json[task].valueOf();
        } else if (json[task].valueOf() == null) {
          document.getElementById(id.concat(iterations.toString())).style.display = "none";
        }
      }
      iterations = 0;
    }, 0);
  }

  GetDue() {
    var getter = new JSONgetter(this.team, this.option);
    const id = this.id;
    setInterval(function() {
      var json = getter.GetJSON();
      if (debug == true) {
        console.log("dueid: " + id);
        console.log("json: " + json);
      }
      if (json != "N/A") {
        document.getElementById(id).innerHTML = json;
      } else {
        document.getElementById(id).innerHTML = '';
      }
    }, 0);
  }
  GetMOTD() {
    var getter1 = new JSONgetter(null, this.option);
    var getter2 = new JSONgetter(null, "notes2");
    const id = this.id;
    setInterval(function() {
      var json = getter1.GetJSON();
      if (debug == true) {
        console.log("divid: " + id);
        console.log("json: " + json);
      }
      if (json != "N/A") {
        document.getElementById(id).innerHTML =
          '<div class="col s12 card-panel z-depth-4 blue darken-3 white-text"> \
            <h3>' + json + '</h3> \
          </div>';
      } else {
        document.getElementById(id).innerHTML = '';
      }
    }, 0);
  }

  GetNotes() {
    var getter = new JSONgetter(null, this.option);
    var getter2 = new JSONgetter(null, "notes2");
    const id = this.id;
    const option = this.option;
    setInterval(function() {
      var json = getter.GetJSON();
      if (debug == true) {
        console.log("divid: " + id);
        console.log("json: " + json);
      }
      if (option == "notes1") {
        if (json != "N/A") {
          var lol1 = getter2.GetJSON();
          if (lol1 == "N/A") {
            document.getElementById(id).innerHTML =
              '<div class="col s12"> \
                <div class="card-panel z-depth-4 blue darken-3 white-text" style="min-height: 50px;"> \
                  <h5>' + json + '</h5> \
                </div> \
              </div>';
          } else {
            document.getElementById(id).innerHTML =
              '<div class="col s6"> \
                <div class="card-panel z-depth-4 blue darken-3 white-text" style="min-height: 50px;"> \
                  <h5>' + json + '</h5> \
                </div> \
              </div>';
          }
        } else {
          document.getElementById(id).innerHTML = '';
        }
      }
      if (option == "notes2") {
        if (json != "N/A") {
          document.getElementById(id).innerHTML =
            '<div class="col s6"> \
              <div class="card-panel z-depth-4 blue darken-3 white-text" style="min-height: 50px;"> \
                <h5>' + json + '</h5> \
              </div> \
            </div>';
        } else {
          document.getElementById(id).innerHTML = '';
        }
      }
    }, 0);
  }

}
