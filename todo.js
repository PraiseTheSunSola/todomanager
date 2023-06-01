const colors = [
  "#ef5777",
  "#575fcf",
  "#4bcffa",
  "#34e7e4",
  "#0be881",
  "#f53b57",
  "#3c40c6",
  "#0fbcf9",
  "#00d8d6",
  "#05c46b",
  "#ffc048",
  "#ffdd59",
  "#ff5e57",
  "#d2dae2",
  "#485460",
  "#ffa801",
  "#ffd32a",
  "#ff3f34",
];

let dragTarget = null; //초기화 = 원래 모습으로 돌아간다.

display();

function 색추출기(colors) {
  const 랜덤값 = Math.floor(Math.random() * colors.length); // 0 ~ 17까지
  return colors[랜덤값];
}
// newTag는 DOM 객체
document.querySelector("button").addEventListener("click", (e) => {
  const text = document.querySelector("input").value;

  // local storage 저장
  const todo객체 = {};
  todo객체.text = document.querySelector("input").value;
  todo객체.category = "todo";
  todo객체.id = Date.now();
  localStorage.setItem(todo객체.id, JSON.stringify(todo객체));

  // 새로운 태그 생성
  const newTag = createTag(text, todo객체.id);
  document.querySelector(".todo").appendChild(newTag);

  // input 값 삭제 (초기화)
  document.querySelector("input").value = "";
});

const boxes = document.querySelectorAll(".box");
boxes.forEach((box, i) => {
  box.addEventListener("dragover", (e) => {
    e.preventDefault();
  });
  box.addEventListener("drop", (e) => {
    e.currentTarget.appendChild(dragTarget); //() 안에는 현재 드래깅 되고있는 태그 요소
    const todo = JSON.parse(
      localStorage.getItem(dragTarget.getAttribute("key"))
    );
    todo.category = e.currentTarget.getAttribute("category");
    console.log(todo);
    localStorage.setItem(todo.id, JSON.stringify(todo));
  });
});

function createTag(text, key) {
  // 새로운 p 태그요소를 생성
  const newTag = document.createElement("p");
  newTag.innerHTML = text; // 새로 추가
  newTag.style.backgroundColor = 색추출기(colors);
  newTag.setAttribute("draggable", true);
  // setAttribute는 속성 추가 가능함
  // p태그 요소의 dragstart 이벤트 함수
  newTag.addEventListener("dragstart", (e) => {
    dragTarget = e.currentTarget;
  });
  /**** 삭제버튼 생성 코드 - 시작 */
  const deleteBtn = document.createElement("span");
  deleteBtn.classList.add("delete");
  deleteBtn.innerHTML = "X";
  //삭제 버튼의 클릭 이벤트 함수
  deleteBtn.addEventListener("click", (e) => {
    e.currentTarget.parentElement.remove();
    const key = e.currentTarget.parentElement.getAttribute("key");
    localStorage.removeItem(key);
  });
  newTag.appendChild(deleteBtn);
  /**** 삭제버튼 생성 코드 - 끝  */
  newTag.setAttribute("key", key); // 새로 추가!
  return newTag; // 새로 추가!
}

// 화면 로딩시 딱 한번 호출되서 저장되었던 데이터를 화면에 표시해줌.
function display() {
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i); // key(i)는 index를 받아온다.
    const todo = JSON.parse(localStorage.getItem(key));
    const newTag = createTag(todo.text, todo.id);
    document.querySelector(`.${todo.category}`).appendChild(newTag);
  }
}

/*
1) text : 할일 텍스트.. 사용자 인풋에 적은 내용
2) category: todo, doing, done 
3) id : 중복되지 않는 유니크한 값(현재시간)
*/

/*
1) 드래거블 속성 추가
<p draggable = "true">자바스크립트 공부</p>
setAttribute 필요

2) box1, box2, box3 에 드래그 관련 이벤트 추가
: "drop" "dragover"
: "dragover" 이벤트는 e.preventDefault() 적용
: "drop" 이벤트는
<p draggble="true">자바스크립트 공부</p>

: "drop" 이벤트가 발생한 e.currentTarget
appendChild() 해야함

3) 현재 드래그되고 있는 태그요소를
"dragstart" 이벤트를 p태그에 등록!
*/

/***** Todo 프로젝트 남은 기능 ******/

/*
   1) 카테고리의 변화 저장 기능 
(todo <-> doing <-> done)
==> drop 이벤트 함수에 추가!!!

---------------------------------------------------------------------------
1-1. HTML box class 안에 category="todo" category="doing" category="done"를 추가.

1-2. key값을 담아둘 곳이 필요하니 drop 이벤트 영역에 const todo = localStorage.getItem();

* "drop" 이벤트에서  e.currentTarget는 드롭을 당하는 박스 자체(p태그 포함)
* .appendChild(dragTarget)의 dragTarget은 p.

1-3 key 값은 todo객체.id = Date.now();이고 이 key값을 읽기 위해서 
    newTag.setAttribute("key", todo객체.id);를 추가한다. 

1-4 그 후 const todo = localStorage.getItem()의 ()안에 dragTarget.getAttribute("key")를 추가!

1-5 const todo = localStorage.getItem(); 앞에 JSON.parse를 추가하여 
    const todo = JSON.parse(localStorage.getItem(dragTarget.getAttribute("key"))); 이 된다.

1-6 todo.category = e.currentTarget.getAttribute("category"); 까지 추가하면 
    이제 드롭을 할 시, console.log(todo)에서  카테고리가 맞게 바뀌는걸 볼 수 있다. 

* todo.category = e.currentTarget은 <div class="box! 

1-7 localStorage.setItem(todo.id, JSON.stringify(todo)); 를 추가하면 Application에서
    카테고리가 바뀌는걸 확인할 수 있다.
---------------------------------------------------------------------------



2) todo 할 일 삭제시 저장테이터도 삭제
 ==> 삭제 버튼 클릭 이벤트 함수에 추가!!!

---------------------------------------------------------------------------
2-1 localstorage.removeItem(key) 이용.
    key 값을 얻기 위해 현재 클릭 이벤트가 발생되고 있는 부모의 대상에 key 속성을 부여한다.
    const key = e.currentTarget.parentElement.getAttribute("key");

2-2 localStorage.removeItem(key);까지 추가 후 새로 만들어지는 리스트들부터 X버튼 누를 시 
    Application에서에서도 데이터가 삭제된다.


---------------------------------------------------------------------------

 3) 페이지 로딩(새로고침)시 저장데이터를 화면에 출력
==> 페이지 로딩(새로고침)시 화면 출력 기능 새로 추가!!!

==> 
   * 페이지 로딩시 화면을 출력하는 함수 display ();
     display 함수는 로딩 시 한 번만 호출됨.
    1. for loop를 돌면서 local storage의 저장 데이터를 읽음.
    2. 저장데이터( = todo 데이터)의 정보를 이용하여 새로운 p tag를 만듬
    3. new p tag를 category에 따라 나눠서 appendChild 해줌.
    4. 기존 함수들 중 필요한 부분을 떼어낸 후 재사용 가능하게 재구성한다. 
---------------------------------------------------------------------------

3-1  기존 코드 첨삭 및 function createTag() {}를 만들어서  
     createTag 함수 안에 기존 코드를 수정해서 구성한다.

3-2  function display () {}를 만든다.

3-3  function display의 {}안에 for loop를 만들고 저장하면 for loop를 돌면서
     저장데이터( = todo 데이터)의 정보를 이용하여 새로운 p tag를 만듬

---------------------------------------------------------------------------
// 코드 설명 //

1. const colors = [...]: 색상 값을 담고 있는 배열입니다. 
   각 색상은 16진수 형태로 표현되어 있습니다.

2. let dragTarget = null;: 드래그 대상을 저장하는 변수입니다. 
   초기값은 null로 설정되어 있습니다.

3. display(): 화면에 저장된 데이터를 표시하는 함수입니다. 
   localStorage에 저장된 데이터를 읽어와서 해당 데이터에 맞는 태그를 생성하여 
   화면에 추가합니다.

4. 색추출기(colors): colors 배열에서 랜덤한 색상을 선택하여 반환하는 함수입니다.

5. document.querySelector("button").addEventListener("click", (e) => 
   { ... });: 버튼의 클릭 이벤트를 처리하는 부분입니다. 
   사용자가 입력한 텍스트를 가져와서 새로운 태그를 생성하여 화면에 추가하고,
   입력값을 초기화합니다. 또한, localStorage에도 입력값을 저장합니다.

6. const boxes = document.querySelectorAll(".box");: .box 클래스를 가지는 
   요소들을 모두 선택합니다. 이 요소들은 드롭 영역을 나타냅니다.

7. boxes.forEach((box, i) => { ... });: 선택한 .box 요소들에 대해 
   각각 드래그 관련 이벤트를 처리하는 부분입니다. 드래그 영역에서 
   드래그를 허용하도록 설정하고, 드롭이 발생했을 때 해당 요소에 드래그 대상을 
   추가하고 localStorage에 해당 데이터의 카테고리를 업데이트합니다.

8. createTag(text, key): 새로운 태그를 생성하는 함수입니다. 
   함수에 전달된 텍스트와 키 값을 사용하여 새로운 <p> 태그를 생성하고, 
   색상을 랜덤하게 설정합니다. 또한, 드래그 이벤트와 삭제 버튼 클릭 이벤트를 
   설정하여 기능을 추가합니다. 생성된 태그에는 고유한 키 값도 설정됩니다.

9. display(): 초기화면 로딩 시에 호출되어 localStorage에 저장된 데이터를 
   읽어와서 화면에 표시합니다. 각 데이터에 해당하는 새로운 태그를 생성하여 
   해당 카테고리 영역에 추가합니다.

  이상으로 이 코드는 사용자의 입력과 드래그 액션을 처리하여 To-Do 리스트를 
  관리하는 기능을 구현한 코드입니다.
  
---------------------------------------------------------------------------
*/
