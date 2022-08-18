// Header Component

const Header = (props) =>{

    return(

      <header>
        <h1>Hug in a 'Mug'!</h1>
        <i className="fa-solid fa-cart-shopping " onClick={props.handleCart}>
        <p onClick={props.handleCart}>{props.totalCount} </p>
        </i> 
      </header>
    )

}

export default Header;


