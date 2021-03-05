//設定表單按鈕行為
let add = document.querySelector("form button");
let section = document.querySelector("section");

//監聽按鈕
add.addEventListener("click" , e =>{
    //保存表單表面資料以方便多筆輸入，原表單送出按鈕後默認將資料清除
    e.preventDefault();
    //抓取form(parent)下的input(children)輸入資料
    let form = e.target.parentElement;
    console.log(e.target.parentElement);
    //利用陣列抓取form(parent)下的4個input(children)的資料
    let todoText = form.children[0].value;
    let todoYear = form.children[1].value;
    let todoMonth = form.children[2].value;
    let todoDate = form.children[3].value;
    console.log(todoText, todoYear, todoMonth, todoDate);

    if(todoText ===""){
        alert("請輸入事項");
        return;
        //在符合條件後，停止執行if後的程式
    }

    if(todoYear ===""){
        alert("請輸入年");
        return;
    }

    if(todoMonth ===""){
        alert("請輸入月");
        return;
    }

    if(todoDate ===""){
        alert("請輸入日");
        return;
    }

    //在section下新增div跟p
    let todo = document.createElement("div");
    todo.classList.add("todo"); //在section下div的class ="todo"
    //插入事項
    let text = document.createElement("p");
    text.classList.add("todo-text");//在section下div下的p的class ="todo-text"
    text.innerText = todoText;

    //插入時間:年月日
    let time =document.createElement("p");
    time.classList.add("todo-time");
    time.innerText = todoYear + "/" + todoMonth + "/" + todoDate;

    //利用appendChild()在section內插入文字
    todo.appendChild(text);
    todo.appendChild(time);

    

    //插入icon-check and trash，因為要有文字出現後才會出現icon所以用js設定
    let completeBtn = document.createElement("button"); 
    completeBtn.classList.add("complete");//div的class="complete"
    completeBtn.innerHTML = '<i class="far fa-check-square"></i>';
    completeBtn.addEventListener("click", e =>{
        let todoItem = e.target.parentElement;
        // console.log(e.target); //可偵測到div上的i干擾toggle()事件進行，所以要在CSS去除i的干擾

         // todoItem.classList.add("done"); //只能加上刪除線無法回收，因為使用add()
        todoItem.classList.toggle("done");
    })


    //trash的icon
    let deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete");
    deleteBtn.innerHTML ='<i class="far fa-trash-alt"></i>';

    //為產生刪除後往上移的效果，scaleUp轉為scaleDown後，透過remove()徹底刪除標籤
    deleteBtn.addEventListener("click", e =>{
        let todoItem = e.target.parentElement;

        //常理為動畫結束後刪除，但刪除是由"click"後產生，所以須放在"click", e事件內
        //也由於動畫和刪除時間差過點無法產生效果，所以刪除必須是在動畫結束後(animationend:事件會在CSS動畫完成時執行)
        //()不需要e，因為不需要事件產生
        todoItem.addEventListener("animationend", () =>{

            //刪除放在LocalStorage的資料:拿出選定的已存在儲存資料刪掉後，剩下的資料再放回去
            let text = todoItem.children[0].innerHTML;
            let myListArray = JSON.parse(localStorage.getItem("list"));
            //從陣列中挑選出相對應名稱，並刪除整列
            myListArray.forEach( (item, index) => {
                if(item.todoText == text){
                    myListArray.splice(index, 1 );
                    localStorage.setItem("list", JSON.stringify(myListArray));
                }
            });

            todoItem.remove();
        });

        todoItem.style.animation = "scaleDown 0.3s forwards";
    });


    todo.appendChild(completeBtn);
    todo.appendChild(deleteBtn);

    todo.style.animation = "scaleUp 0.5s forwards";

    //多項資料常利用物件方式轉乘陣列，在LocalStorage儲存資料
    //設立物件
    let myTodo = {
        todoText: todoText,
        todoYear: todoYear,
        todoMonth: todoMonth,
        todoDate: todoDate,
    };

    //將值轉化成陣列，kye為list
    let myList = localStorage.getItem("list");
    //如果頁面(localStorage內)為空值就將list透過JSON.stringify(將物件序列化)轉為字串[myTodo]儲存在localStorage內
    if(myList === null){
        localStorage.setItem("list" , JSON.stringify([myTodo]));
    }else{
        //舊資料加上新資料
        //若頁面(localStorage內)已有資料(為陣列)
        let myListArray = JSON.parse(myList);
        //就透過JSON.parse將localStorage內的資料(let myList)將JSON字串轉換成JavaScript的數值或是物件，倒入myTodo{物件}，轉成陣列
        myListArray.push(myTodo);
        //再加上新增的資料，新資料轉成陣列方式同if
        localStorage.setItem("list" , JSON.stringify(myListArray));
    }


    //按下新增鈕後，清除事項欄位，保留其他欄位值
    form.children[0].value = "";

    ////按下新增鈕後，清除事項欄位其他欄位值，保留事項欄位
    // form.children[1].value = "";
    // form.children[2].value = "";
    // form.children[3].value = "";

    section.appendChild(todo);
});


//呼叫已設定之unction loadData()，放在最末尾也可以，但就是必須呼叫
loadData();

//設代數程式unction loadData()
function loadData(){
    //從localStorage抓出資料，顯示在section
    let myList = localStorage.getItem("list");
    if(myList !== null){
        let myListArray = JSON.parse(myList);
        myListArray.forEach(item =>{
        
        //要顯示在section
        //要手動加上item
        let todo = document.createElement("div");
        todo.classList.add("todo");

        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todoText;


        let time =document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todoYear + "/" + item.todoMonth + "/" + item.todoDate;


        todo.appendChild(text);
        todo.appendChild(time);
        
        let completeBtn = document.createElement("button"); 
        completeBtn.classList.add("complete");
        completeBtn.innerHTML = '<i class="far fa-check-square"></i>';
        completeBtn.addEventListener("click", e =>{
            let todoItem = e.target.parentElement;
            todoItem.classList.toggle("done");
        });


        let deleteBtn = document.createElement("button");
        deleteBtn.classList.add("delete");
        deleteBtn.innerHTML ='<i class="far fa-trash-alt"></i>';

        deleteBtn.addEventListener("click", e =>{
            let todoItem = e.target.parentElement;

            todoItem.addEventListener("animationend", () =>{
                let text = todoItem.children[0].innerHTML;
                let myListArray = JSON.parse(localStorage.getItem("list"));
                myListArray.forEach( (item, index) => {
                    if(item.todoText == text){
                        myListArray.splice(index, 1 );
                        localStorage.setItem("list", JSON.stringify(myListArray));
                    }
                });
                todoItem.remove();
            })

            todoItem.style.animation = "scaleDown 0.3s forwards";
        });

        todo.appendChild(completeBtn);
        todo.appendChild(deleteBtn);

        todo.style.animation = "scaleUp 0.5s forwards";
        section.appendChild(todo);

        });
    }
}

//排序時間
//設定function mergeTime()執行方式
function mergeTime(arr1, arr2){
    let result = [];
    let i = 0;
    let j = 0;
    //先比較年大小後排序，若年大小相同就比較月，比較月大小後排序，月相同就比較日，日比較大小後排序
    //越舊在越前
    while (i < arr1.length && j < arr2.length) {
        if( Number(arr1[i].todoYear) > Number(arr2[j].todoYear) ){
            result.push( arr2[j] );
            j++;
        }else if(Number(arr1[i].todoYear) < Number(arr2[j].todoYear)){
            result.push(arr1[i]);
            i++;

        //年相同就比月
        }else if (Number(arr1[i].todoYear) == Number(arr2[j].todoYear)){
            if(Number(arr1[i].todoMonth) > Number(arr2[j].todoMonth)){
                result.push( arr2[j] );
                j++;
            }else if (Number(arr1[i].todoMonth) < Number(arr2[j].todoMonth)){
                result.push(arr1[i]);
                i++;

            //月相同就比日期
            }else if (Number(arr1[i].todoMonth) == Number(arr2[j].todoMonth)){
                if (Number(arr1[i].todoDate) > Number(arr2[j].todoDate)){
                    result.push(arr2[j]);
                    j++;
                }else{
                    result.push(arr1[i]);
                    i++; 
                }
            }
        }

    } 
    
    //由於資料比較時，只能對比左右兩筆，例如3筆資料會被切成1.5筆取1筆資料，中間的0.5+0.5筆便被會忽略未比較到。
    //因此，若出現奇數筆資料時便會缺少該筆資料，資料筆數長度也不會正確
    while( i < arr1.length){
        result.push ( arr1[i] );
        i++;
    }
    while( j < arr2.length){
        result.push ( arr2[j] );
        j++;
    }
    return result;
}

//執行function mergeTime()，JavaScript的特性為方法()之呼叫不管在function宣告前或後都可以找到宣告內容
//但仍建議方法()呼叫放在function宣告後

//比較多筆資料的function
//透過mergeSort(arr)導入將mergeTime()的資料切成左右兩筆資料，再透過mergeTime()排序
//資料比較時，由於只能對比左右兩筆，例如3筆資料會被切成1.5筆取1筆資料，和形成中間的0.5+0.5筆
function mergeSort(arr){
    //如資料筆數為1
    if ( arr.length === 1 ){
        return arr ;
    //若是2筆以上
    } else {
        let middle = Math.floor ( arr.length / 2 );
        let right = arr.slice ( 0, middle );
        let left = arr.slice ( middle, arr.length);
        return mergeTime(mergeSort(right), mergeSort(left));
    }
    
}
console.log(mergeSort(JSON.parse(localStorage.getItem("list"))));

//設定按鈕可排序時間
let sortBtn = document.querySelector("div.sort button");
sortBtn.addEventListener("click", () => {
    //先將localStorage內的資料排序，再丟回localStorage
    let sortedArray = mergeSort (mergeSort(JSON.parse(localStorage.getItem("list"))));
    localStorage.setItem( "list", JSON.stringify(sortedArray));

    //畫面呈現排序好的資料：先刪除section畫面的資料，再從localStorage內抓出已排序好的資料
    //刪除section畫面的資料
    let len = section.children.length;
    for ( let i = 0; i < len; i++){
        section.children[0].remove(); 
    }

    //重新再入localStorage已排序好的資料
    loadData();
})