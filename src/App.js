
import './App.css';
import firebase from './firebase';
import { getDatabase, ref, onValue, update,remove} from 'firebase/database';
import { useState, useEffect } from 'react';

import Header from './components/Header';
import Footer from './components/Footer';


function App() {
  const [pictures, setPictures] = useState([]);
  const [openCart, setCart] = useState(false);

  const [userCart, setUserCart] = useState ([]);

  // when page loads, call useEffect to connect to firebase and load data from the "inventory" object 
  useEffect(()=>{

    // holding database details
    const database = getDatabase(firebase);

    // variable that reference the specific location of our database
    const dbRef = ref(database, );

    onValue(dbRef, (response) =>{
      
      const newInventory = [];
      const newUserCart = [];
      const inventory = response.val().inventory;
      const userSelectedCart = response.val().userSelectedCart;
      // console.log(userSelectedCart)
    
      for (let key in inventory){
        
        // (userCart[key],key)
        // console.log(inventory[key])
        newInventory.push(
          {
            key,
            title: inventory[key].title,
            imgUrl:inventory[key].imgUrl,
            price:inventory[key].price,
            // if the userSelectedCart does not contain the key, we will set the count to 0, otherwise we get the count from userSelectedCart 
            count: userSelectedCart[key] ? userSelectedCart[key].count : 0
            
          }
          )
          // console.log(inventory[key].title)
          // console.log(key)
      }

      for( let key in userSelectedCart){

        newUserCart.push(
          {
            key,
            title: userSelectedCart[key].title,
            imgUrl:userSelectedCart[key].imgUrl,
            price:userSelectedCart[key].price,
            count: userSelectedCart[key].count
          })
      }
      setPictures(newInventory);

      setUserCart(newUserCart);

    })
  },[])


  // function when user click add to cart button
  const add = function(userSelectItem){

    const database = getDatabase(firebase);
    const dbRef = ref(database, '/userSelectedCart');

    const userSelectedItemInfo = {
      [userSelectItem.key]:{
        price: userSelectItem.price,
        imgUrl: userSelectItem.imgUrl,
        title: userSelectItem.title,
        count: userSelectItem.count + 1
      }      
    }  
    update(dbRef, userSelectedItemInfo)
  }


  // when user click delete from cart inside shopping cart Nav
  const minus = function (userRemoveItem){
    
    const database = getDatabase(firebase);
    const itemsToRemove = userRemoveItem.key
    
    const address = `userSelectedCart/${itemsToRemove}`

    const dbRef = ref(database, `/${address}`);

    console.log(itemsToRemove)
    remove(dbRef,itemsToRemove)

  }


  const handleCart = function(){
    setCart(!openCart)
  }

  // updated the shopping cart number 
  const getTotalCount = function(shoppingCart){
    let totalCount = 0;
    shoppingCart.forEach((item)=>{
      totalCount = totalCount + item.count
      // for every item, increase the totalcount by the item.count
    })

    return totalCount;

  }



  // function to calculate total amount 
  const totalAmountCalculator = (userPickedItems)=>{
    let totalAmount = 0
    userPickedItems.forEach((item)=>{
      totalAmount = totalAmount + item.price * item.count
    })
    return totalAmount
  }



  return (
    <div className="App">

      <Header handleCart={handleCart} totalCount ={getTotalCount(userCart)} />

      {
       pictures &&(
          pictures.map( (pics) => {
           return(
             <div className='itemContainer' key={pics.key}>
               <img src={pics.imgUrl} alt={pics.title}/>
               <figcaption>{pics.title}</figcaption>
               <p>${pics.price}</p>
             
               <div className="buttonContainer">
                 <button onClick={()=>{add(pics)}}>add to cart</button>
                 {/* <button onClick={minus}>Delete</button> */}
               </div>
             </div>
            )
          })
        )

      }

      {/* when open shopping cart */}
      <nav className={openCart ? 'cart' : null}>
        <ul>
          {
            userCart && (
              userCart.map((cart)=>{
                // console.log(cart.key)
                // get the amount for each item added to cart
                const itemAmount = cart.count * cart.price;
                return(
                  <li key={cart.key}>
                    <img src={cart.imgUrl} alt={cart.title} />
                    {/* <p> {cart.title}</p> */}
                    {/* <p>${cart.price}</p> */}
                    <article>Quantity: {cart.count}</article>
                    <p>Amount: ${itemAmount}</p>
                    <button onClick={()=>{minus(cart)}}>remove 🗑️</button>
                  </li>
                )
                
              })
            )
          }

          <p> -Your total Amount: ${totalAmountCalculator(userCart)}  </p>
          <li onClick={handleCart}>❌</li>
        </ul>
      </nav>


      <Footer />
    </div>
  );
  

}

export default App;
