const temp = document.getElementById("temp"),
date= document.getElementById("date-time"),

currentLocation=document.getElementById("location"),
condition=document.getElementById("condition"),
rain=document.getElementById("rain"),
mainIcon=document.getElementById("icon"),
// currentLocation = document.getElementById("location");
uvIndex = document.querySelector(".uv-index"),
uvText = document.querySelector(".uv-text"),
windSpeed = document.querySelector(".wind-speed"),
sunRise = document.querySelector(".sunrise"),
sunSet = document.querySelector(".sunset"),
humidity = document.querySelector(".humidity"),
visibilty = document.querySelector(".visibility"),
humidityStatus = document.querySelector(".humidity-status"),
airQuality = document.querySelector(".air-quality"),
airQualityStatus = document.querySelector(".air-quality-status"),
visibilityStatus = document.querySelector(".visibility-status"),
hourlyBtn = document.querySelector(".hourly"),
  weekBtn = document.querySelector(".week"),
  weatherCards = document.querySelector("#weather-cards"),
  celciusBtn = document.querySelector(".celcius"),
  fahrenheitBtn = document.querySelector(".fahrenheit"),
  tempUnit = document.querySelectorAll(".temp-unit"),
  searchForm = document.querySelector("#search"),
  search = document.querySelector("#query");
  
  


    let currentcity= "";
    let currentUnit = "c";
    let hourlyorweek="Week";    

//Update datetime
function getdatetime(){
    let now = new Date(),
    hour = now.getHours(),
    minute = now.getMinutes();

    let days = [
        "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday","Friday","Saturday"
    ];
    //12 hour format
    hour = hour%12;
    if (hour<10){
        hour = "0"+hour ;   }   
    if (minute<10){
        minute = "0"+minute;
    }
    let dayString = days[now.getDay()];
    return `${dayString}, ${hour}: ${minute}`;  
}
date.innerText= getdatetime();

setInterval(()=>{
    date.innerText = getdatetime();
},1000);

function getpublicip(){
    fetch("https://geolocation-db.com/json/",{
        method:"GET",
    })
     .then((response)=>response.json())
     .then((data)=>{
        console.log(data);
        currentCity=data.city;
        getWeatherData(data.city,currentUnit,hourlyorweek);
     });
}
getpublicip();  

function getWeatherData(city, unit, hourlyorweek) {
    const apiKey = "N4AE6HDFP43QJCG3JPTBTZEBU";
    fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?unitGroup=metric&key=${apiKey}&contentType=json`,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        let today= data.currentConditions;
        if(unit==="c"){
            temp.innerText=today.temp;
        }
        else{
            temp.innerText=celtofah(today.temp);
        }
        currentLocation.innerText=data.resolvedAddress;
        condition.innerText=today.conditions;   
        rain.innerText="Perc-"+today.precip+"%";
        uvIndex.innerText=today.uvindex;
        windSpeed.innerText=today.windspeed;
        humidity.innerText=today.humidity + "%";
        visibilty.innerText=today.visibility;
        airQuality.innerText=today.winddir;
        measureUvIndex(today.uvindex);  
        updateHumidityStatus(today.humidity);
        updateVisibiltyStatus(today.visibility);
        updateAirQualityStatus(today.winddir);
        sunRise.innerText=convertTimeTo12HourFormat(today.sunrise);
        sunSet.innerText=convertTimeTo12HourFormat(today.sunset);
        mainIcon.src=getIcon(today.icon);
        changeBackground(today.icon);
        
        if (hourlyorweek === "hourly") {
          updateForecast(data.days[0].hours, unit, "day");
        } else {
          updateForecast(data.days, unit, "week");
        }

  })
  .catch((err) => {
    alert("City not found in our database");
  });
}

function celtofah(temp){

    return ((temp*9)/5 + 32).toFixed(1);
}

function measureUvIndex(uvIndex) {
    if (uvIndex <= 2) {
      uvText.innerText = "Low";
    } else if (uvIndex <= 5) {
      uvText.innerText = "Moderate";
    } else if (uvIndex <= 7) {
      uvText.innerText = "High";
    } else if (uvIndex <= 10) {
      uvText.innerText = "Very High";
    } else {
      uvText.innerText = "Extreme";
    }
  }

  function updateHumidityStatus(humidity) {
    if (humidity <= 30) {
      humidityStatus.innerText = "Low";
    } else if (humidity <= 60) {
      humidityStatus.innerText = "Moderate";
    } else {
      humidityStatus.innerText = "High";
    }
  }

  function updateVisibiltyStatus(visibilty) {
    
    if (visibilty <= 0.03) {
      visibilityStatus.innerText = "Dense Fog";
    } else if (visibilty <= 0.16) {
      visibilityStatus.innerText = "Moderate Fog";
    } else if (visibilty <=  0.35) {
      visibilityStatus.innerText = "Light Fog";
    } else if (visibilty <= 1.13) {
      visibilityStatus.innerText = "Very Light Fog";
    } else if (visibilty <= 2.16) {
      visibilityStatus.innerText = "Light Mist";
    } else if (visibilty <= 5.4) {
      visibilityStatus.innerText = "Very Light Mist";
    } else if (visibilty <= 10.8) {
      visibilityStatus.innerText = "Clear Air";
    } else {
      visibilityStatus.innerText = "Very Clear Air";
    }
  }
  
  // function to get air quality status
  function updateAirQualityStatus(airquality) {
    if (airquality <= 50) {
      airQualityStatus.innerText = "Good👌";
    } else if (airquality <= 100) {
      airQualityStatus.innerText = "Moderate😐";
    } else if (airquality <= 150) {
      airQualityStatus.innerText = "Unhealthy for Sensitive Groups😷";
    } else if (airquality <= 200) {
      airQualityStatus.innerText = "Unhealthy😷";
    } else if (airquality <= 250) {
      airQualityStatus.innerText = "Very Unhealthy😨";
    } else {
      airQualityStatus.innerText = "Hazardous😱";
    }
  }
  
  function convertTimeTo12HourFormat(time) {
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let ampm = hour >= 12 ? "pm" : "am";
    hour = hour % 12;
    hour = hour ? hour : 12; // the hour '0' should be '12'
    hour = hour < 10 ? "0" + hour : hour;
    minute = minute < 10 ? "0" + minute : minute;
    let strTime = hour + ":" + minute + " " + ampm;
    return strTime;
  }

  function getIcon(condition) {
    if (condition === "partly-cloudy-day") {
      return "https://i.ibb.co/PZQXH8V/27.png";
    } else if (condition === "partly-cloudy-night") {
      return "https://i.ibb.co/Kzkk59k/15.png";
    } else if (condition === "rain") {
      return "https://i.ibb.co/kBd2NTS/39.png";
    } else if (condition === "clear-day") {
      return "https://i.ibb.co/rb4rrJL/26.png";
    } else if (condition === "clear-night") {
      return "https://i.ibb.co/1nxNGHL/10.png";
    } else {
      return "https://i.ibb.co/rb4rrJL/26.png";
    }
  }

  function getDayName(date) {
    let day = new Date(date);
    let days = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return days[day.getDay()];
  }

  function getHour(time) {
    let hour = time.split(":")[0];
    let min = time.split(":")[1];
    if (hour > 12) {
      hour = hour - 12;
      return `${hour}:${min} PM`;
    } else {
      return `${hour}:${min} AM`;
    }
  }

  function updateForecast(data, unit, type) {
    weatherCards.innerHTML = "";
    let day = 0;
    let numCards = 0;
    if (type === "day") {
      numCards = 24;
    } else {
      numCards = 7;
    }
    for (let i = 0; i < numCards; i++) {
      let card = document.createElement("div");
      card.classList.add("card");
      let dayName = getHour(data[day].datetime);
      if (type === "week") {
        dayName = getDayName(data[day].datetime);
      } 
      let dayTemp = data[day].temp;
      if (unit === "f") {
        dayTemp = celtofah(data[day].temp);
      }
      let iconCondition = data[day].icon;
      let iconSrc = getIcon(iconCondition);
      let tempUnit = "°C";
      if (unit === "f") {
        tempUnit = "°F";
      }
      card.innerHTML=`<h2 class="day-name">${dayName}</h2>
      <div class="card-icon">
          <img src="${iconSrc}"/>
      
      
    </div>
    <div class="day-temp">
      <h2 class="temp">${dayTemp}</h2>
      <span class="temp-unit">${tempUnit}</span>
    </div>`;
   weatherCards.appendChild(card);
   day++;
        
    }
  }

  function changeBackground(condition) {
    const body = document.querySelector("body");
    let bg = "";
    if (condition === "partly-cloudy-day") {
      bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    } else if (condition === "partly-cloudy-night") {
      bg = "https://i.ibb.co/RDfPqXz/pcn.jpg";
    } else if (condition === "rain") {
      bg = "https://i.ibb.co/h2p6Yhd/rain.webp";
    } else if (condition === "clear-day") {
      bg = "https://i.ibb.co/WGry01m/cd.jpg";
    } else if (condition === "clear-night") {
      bg = "https://i.ibb.co/kqtZ1Gx/cn.jpg";
    } else {
      bg = "https://i.ibb.co/qNv7NxZ/pc.webp";
    }
    body.style.backgroundImage = `linear-gradient( rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5) ),url(${bg})`;
  }

 


  fahrenheitBtn.addEventListener("click",()=>{
    changeUnit("f");
  });
  celciusBtn.addEventListener("click",()=>{
    changeUnit("c");
  });


  function changeUnit(unit) {
    if (currentUnit !== unit) {
      currentUnit = unit;
      {

      
      tempUnit.forEach((elem) => {
        elem.innerText = `°${unit.toUpperCase()}`;
      });
      if (unit === "C") {
        celciusBtn.classList.add("active");
        fahrenheitBtn.classList.remove("active");
      } else {
        celciusBtn.classList.remove("active");
        fahrenheitBtn.classList.add("active");
      }
      getWeatherData(currentCity, currentUnit, hourlyorweek);
    }
    
    }
  } 

  

  
  
  // function to change hourly to weekly or vice versa
  function changeTimeSpan(unit) {
    if (hourlyorweek !== unit) {
      hourlyorweek = unit;
      if (unit === "hourly") {
         hourlyBtn.classList.add("active");
        weekBtn.classList.remove("active");
      } else {
        hourlyBtn.classList.remove("active");
        weekBtn.classList.add("active");
      }
      getWeatherData(currentCity, currentUnit, hourlyorweek);
    }
  }
  
  
  hourlyBtn.addEventListener("click", () => {
    changeTimeSpan("hourly");
  });
  weekBtn.addEventListener("click", () => {
    changeTimeSpan("week");
  });

  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let location = search.value;
    if (location) {
      currentCity = location;
      getWeatherData(location, currentUnit, hourlyorweek);
    }
  });





      