// Select all the star with i tag and store in nodelist called star
const stars = document.querySelectorAll('.star i');

// Loop through the stars
stars.forEach((star, index1) => {
    // add an event listner that runs a function when the click event is targeted
    star.addEventListener('click', () => {
        // loop thorugh the stars
        stars.forEach((star, index2) => {
            index1 >= index2 ? star.classList.add("active") : star.classList.remove("active")
        });
    });
});