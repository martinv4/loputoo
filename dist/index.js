import axios from "axios";
const api = "https://api.tartunlp.ai/text-to-speech/v2";
const errors = document.querySelector(".errors");
const loading = document.querySelector(".loading");
const cases = document.querySelector(".cases");
const recovered = document.querySelector(".recovered");
const deaths = document.querySelector(".deaths");
const results = document.querySelector(".result-container");
const button = document.querySelector("search-btn")
results.style.display = "none";
loading.style.display = "none";
errors.textContent = "";
// grab the form
const form = document.querySelector(".form-data");
// grab the country name
const country = document.querySelector(".country-name");

// declare a method to search by country name
const searchForCountry = async countryName => {
  loading.style.display = "block";
  errors.textContent = "";
  try {
    const response = await axios.get(`${api}/${countryName}`);
    loading.style.display = "none";
    cases.textContent = response.data.confirmed.value;
    recovered.textContent = response.data.recovered.value;
    deaths.textContent = response.data.deaths.value;
    results.style.display = "block";
    console.log("testsuccess");
  } catch (error) {
    console.log("testfail");
    loading.style.display = "none";
    results.style.display = "none";
    errors.textContent = "We have no data for the country you have requested.";
  }
};

// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();
  searchForCountry(country.value);
  console.log("test");
};

form.addEventListener("submit", e => handleSubmit(e));
button.addEventListener("click", function(e){
    e.preventDefault();

    console.log("test");
})