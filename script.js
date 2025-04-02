document.addEventListener('DOMContentLoaded', () => {
     const submit = document.getElementById('submit');
     let randomCountry = null;

     submit.addEventListener('click', search);
     drawCountry();

     async function drawCountry() {
          try {
               const response = await fetch('https://restcountries.com/v3.1/all');

               if (!response.ok) throw new Error('Erro ao buscar países');

               const countries = await response.json();

               randomCountry = countries[Math.floor(Math.random() * countries.length)];

               console.log(randomCountry);
          } catch (error) {
               console.error(error);
          }
     }

     async function search() {
          const input = document.getElementById('search');
          if (!input.value.trim()) return;

          try {
               const response = await fetch(
                    `https://restcountries.com/v3.1/name/${input.value.trim()}`,
               );
               if (!response.ok) throw new Error('País não encontrado');
               const result = await response.json();
               resetCss();
               completeInformation(result[0]);
          } catch (error) {
               console.error(error);
          }
     }

     function completeInformation(country) {
          document.querySelector('#flag').src = country.flags.png;
          document.querySelector('#language').textContent = Object.values(country.languages).join(
               ', ',
          );

          document.querySelector('#currency').textContent = Object.values(
               country.currencies,
          )[0].name;

          document.querySelector('#continent').textContent = country.continents.join(', ');

          document.querySelector('#population').textContent = populationAverage(country.population);

          document.querySelector('#car').textContent = country.car.side;

          document.querySelector('#area').innerHTML = `${country.area} km²`;

          checkCountry(country);
     }

     function checkCountry(countrySearch) {
          if (!randomCountry) return;

          if (countrySearch.name.common === randomCountry.name.common) {
               alert('Você venceu!');
               setTimeout(() => location.reload(), 3000);
          }

          updateBox('#box-01', hasCommonValue(countrySearch.languages, randomCountry.languages));
          updateBox(
               '#box-02',
               countrySearch.currencies[Object.keys(countrySearch.currencies)[0]].name ===
                    randomCountry.currencies[Object.keys(randomCountry.currencies)[0]].name,
          );

          updateBox(
               '#box-03',
               countrySearch.continents.some(continent =>
                    randomCountry.continents.includes(continent),
               ),
          );

          updateBox(
               '#box-04',
               populationAverage(countrySearch.population) ===
                    populationAverage(randomCountry.population),
          );

          updateBox('#box-05', countrySearch.car.side === randomCountry.car.side);

          updateBox('#box-06', compareArea(countrySearch.area, randomCountry.area));
     }

     function hasCommonValue(obj1, obj2) {
          return Object.values(obj1).some(value => Object.values(obj2).includes(value));
     }

     function updateBox(selector, condition) {
          document.querySelector(selector).classList.add(condition ? 'true' : 'false');
     }

     function compareArea(area1, area2) {
          const areaElem = document.querySelector('#area');
          if (area1 > area2) {
               areaElem.innerHTML += '<br>&#x23EB';
               return false;
          } else if (area1 < area2) {
               areaElem.innerHTML += '<br>&#x23EC';
               return false;
          }
          return true;
     }

     function populationAverage(population) {
          const ranges = [500000000, 400000000, 300000000, 200000000, 100000000, 10000000, 1000000];
          return ranges.find(range => population >= range)
               ? `+${ranges.find(range => population >= range) / 1000000}M`
               : '-1M';
     }

     function resetCss() {
          document.querySelectorAll('.box').forEach(box => box.classList.remove('true', 'false'));
     }
});
