$(document).ready(function() {

  /* * * * * Variables * * * * */
  //API key-Weather Underground 
  var API_url = "http://api.wunderground.com/api/";
  var APIKey = "da05cb6e10950949";
  var url_geo = "/geolookup/q/autoip";
  var url_temp;
  var country;
  var state;
  var city;
  var temp_f;
  var temp_c;
  var icon_w;
  var page_fresh = 0;

  /* * * * * Weather API: Retrive data * * * * */
  function getJSONObj(url_input) {
    if (url_input == url_geo) {
      $.ajax({
        url: API_url + APIKey + url_input + ".json",
        dataType: "jsonp",
        success: function(parsed_json) {
          url_temp = getGeoLookUp(parsed_json);
          getJSONObj(url_temp);
        } /*function()*/
      }); /*ajax end*/
    } else {
      $.ajax({
        url: API_url + APIKey + url_input + ".json",
        dataType: "jsonp",
        success: function(parsed_json) {
          getData(parsed_json);
        } /*function()*/
      }); /*ajax end*/
    } /*if-else end*/
  } /*getJSONObj() end*/

  function getGeoLookUp(parsed_json) {
    var countryIn = parsed_json.location.country_iso3166;
    var cityIn = parsed_json.location.city;
    country = countryIn;
    city = cityIn;
    if (country == "US") {
      var stateIn = parsed_json.location.state;
      state = stateIn;
      url_temp = setURL(state, city);
      return url_temp;
    } else {
      setURL(country, city);
    }
  } /*getGeoLookUp() end*/

  function setURL(varIn, cityIn) {
    //Place underscore in name, ex: San_Francisco
    for (var i = 0; i < arguments.length; i++) {
      arguments[i] = arguments[i].replace(" ", "_");
    }
    url_temp = "/conditions/q/" + arguments[0] + "/" + arguments[1];
    return url_temp;

  } /*setURL() end*/

  function getData(parsed_json) {
    var map_url = parsed_json["current_observation"]["image"]["url"];

    var weather = parsed_json["current_observation"]["weather"];
    var city_state = parsed_json["current_observation"]["display_location"]["full"];
    var country_in = parsed_json["current_observation"]["display_location"]["country_iso3166"];
    temp_f = parsed_json["current_observation"]["temp_f"];
    temp_c = parsed_json["current_observation"]["temp_c"];
    icon_w = parsed_json["current_observation"]["icon_url"];
    setText( map_url, weather, city_state, country_in, temp_f, temp_c, icon_w );

     } /*getData() end*/

  function setDegrees() {
    var temp = $("#degrees").text();
    var F = temp.indexOf("F");
    if ( F > 0 ) {
      $("#degrees").text(temp_c + "\u00B0" + " C");
      F = 0;
    } else {
      $("#degrees").text(temp_f + "\u00B0" + " F");
    }
  } /*setDegrees() end*/

  function setText( map_url, weather, city_state, country_in, temp_f, temp_c, icon_w ) {
    if ( page_fresh !== 0 ) {
      page_fresh = 0;
      //reset text/image to blank
      $("#location").text(" ");
      $("#degrees").text(" ");
      $("#conditions").text(" ");
      $( "#icon_image" ).empty();
    } else {
        page_fresh++;
        $("#location").text(city_state + ", " + country_in);
        $("#degrees").text(temp_f + "\u00B0" + " F");
        $("#conditions").text(weather);
        //weather icon
        $('<img />')
          .attr('src', icon_w)
          .attr('alt', 'weather icon')
          .appendTo('#icon_image');
    }
  } /*setText() end*/

  /* * * * * Button Activates App * * * * */
  $(".pushTemp").on("click", function() {
    url_temp = getJSONObj(url_geo);
  }); /**.pushTemp.on(click) end **/
  
  $(".pushConvert").on("click", function() {
    if ( page_fresh === 0 ) {
      $("#degrees").text('Error: Push "Temp" first');
    } else {
      url_convert = setDegrees(); 
    }
  }); /*.pushConvert.on(click) end*/
} /*.ready(function() end*/ ); /*.ready end*/