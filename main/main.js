const rootElement = document.querySelector("#root");
const BASE_URL = "http://35.76.53.28:8080/";

// Main 페이지에서 판매하는 item
class Item {
    // 이미지, 이름, 가격, 하트가 필요
    constructor({
        id,
        productName,
        price,
        stockCount,
        thumbnailImg,
        option,
        shippingFee,
        discountRate,
        detailInfoImage,
        viewCount,
    }) {
        // 리스트 아이템 생성하기
        this.listElement = document.createElement("li");
        this.listElement.setAttribute("data-id", id);
        this.listElement.setAttribute("class", "product-item");
        this.listElement.innerHTML = `
            <img src=${BASE_URL}${thumbnailImg} alt="${productName} 썸네일 이미지" />
            <p class="product-name">${productName}</p>
            <div class="product-price">
                <p><span>${this.makeMoneysComma(
                    String(
                        Math.floor(
                            price * (100 - discountRate) * 0.001 * 0.01
                        ) * 1000
                    )
                )}</span>원</p>
                ${
                    discountRate
                        ? `<p class="discount-info"><s><span>${price}</span></s><strong>${discountRate}</strong></p>`
                        : ``
                }
            </div>
            
            <button class="heart-btn">
            ${
                id == 3 || id == 4
                    ? `<img src="./asset/img/icon-heart-on.svg" alt="" class="heart-btn_img"></img>`
                    : `<img src="./asset/img/icon-heart-off.svg" alt="" class="heart-btn_img"></img>`
            }
            </button>
        `;

        // 클릭 이벤트 헨들러 추가
        this.listElement.addEventListener("click", handleClick);

        function handleClick() {
            console.log("클릭되었습니다.");
        }
    }

    // 돈에 ','을 붙여주는 메서드
    makeMoneysComma(money) {
        let result = "";
        if (money.length < 4) {
            result = money;
            return result;
        }
        result = "," + money.slice(-3);
        return this.makeMoneysComma(money.slice(0, -3)) + result;
    }
}

// Main 페이지를 나타내는 클래스
class Main {
    constructor(rootElement) {
        this.mainElement = document.createElement("main");
        rootElement.appendChild(this.mainElement);
    }

    // 필요한 데이터 받아오기
    async getData() {
        const response = await fetch("http://35.76.53.28:8080/mall", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });
        const responseData = await response.json();
        console.log(responseData);
        return responseData;
    }

    // 가상 돔으로 성능 최적화
    async drawItems() {
        // 아이템 리스트 생성
        const ulElement = document.createElement("ul");
        ulElement.setAttribute("class", "product-list");

        // 가상돔 요소로 최적화 시키기
        const responseData = await this.getData();
        responseData.map((data) => {
            ulElement.appendChild(new Item(data).listElement);
        });
        this.mainElement.appendChild(ulElement);

        // 장바구니 아이콘 생성
        const shoppingListBtn = document.createElement("button");
        shoppingListBtn.setAttribute("class", "shopping-list-btn");
        shoppingListBtn.innerHTML = `<img src="./asset/img/cart-btn.svg" alt="장바구니 버튼 이미지"></img>`;
        this.mainElement.appendChild(shoppingListBtn);
    }
}

const main = new Main(rootElement);
main.getData();
main.drawItems();
