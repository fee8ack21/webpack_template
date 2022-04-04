// 在每個view js 裡引入該頁CSS，對應到SCSS 7+1 pattern 的pages
import "/styles/pages/home.scss";
import { getTotalPages } from "/js/helpers/_number-helper.js";

console.log("home getTotalPages", getTotalPages(100, 3));
console.log("home getTotalPages", getTotalPages(100, 3));
console.log("home getTotalPages", getTotalPages(100, 3));
console.log("home getTotalPages", getTotalPages(100, 3));

// import small from "../../../assets/images/small.jpeg";
// import big from "../../../assets/images/backgrounds/big.jpeg";
import "/styles/components/image.css";
import "/styles/components/image.scss";
// const bigImage = document.createElement("img");
// bigImage.src = big;

// const smallImage = document.createElement("img");
// smallImage.src = small;

// document.body.appendChild(bigImage);
// document.body.appendChild(smallImage);
