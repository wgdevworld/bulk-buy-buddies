import { list } from "postcss";
import React, { useState, useEffect, Fragment } from "react";
import ProductCard from "./ProductList/ProductCard";
import { useRouter, usePathname, useSearchParams } from 'next/navigation';



export interface Product {
    _id: string;
    name: string;
    price: number;
    src: string;
}
  
const ProductRec = () => {
    // const [userCategory, setUserCategory] = useState<String>('');
    // const [userQuantity, setUserQuantity] = useState<String>('');
    // const [buddyQuantity, setBuddyQuantity] = useState<String>('');
    const [products, setProducts] = useState([]);
    const router = useRouter(); 
    const searchParams = useSearchParams();
    

    useEffect(() => {
        (async () => {
            // retrieve information about the buddy that was clicked
            // INCLUDES: uid of buddy, preferably also information about the active request clicked
            // via session storage? or whatever mechanism we find
            const userCategory = searchParams.get('userCategory');
            const userQuantity = searchParams.get('userQuantity');
            const buddyQuantity = searchParams.get('buddyQuantity')!;
            const location = searchParams.get('location')!;
            // get user information about buddy
            // run request information through backend function to fetch product recommenations 
            fetchProducts(userCategory, userQuantity, buddyQuantity, location)
        })();
      }, []);

    const fetchProducts = async (userCategory: any, userQuantity: any, buddyQuantity: any, location: any ) => {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/fetchSimilarProducts?userCategory=${userCategory}&userQuantity=${userQuantity}&buddyQuantity=${buddyQuantity}&location=${location}`
            );
            if (!response.ok) {
              // Handle success, e.g., show a success message
              console.error('Failed to submit form data');
            } 
            const data = await response.json()
            setProducts(data.results);
          } catch (error) {
            console.error('An error occurred while submitting the form:', error);
          }
    };
    // const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setUserCategory(e.currentTarget.value);
    // };
    // const onUserqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setUserQuantity(e.currentTarget.value);
    // };
    // const onBuddyqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    //     setBuddyQuantity(e.currentTarget.value);
    // };
    // const radioOptions = [
    //     { view: "Chicken", value: "chicken" },
    //     { view: "Pork", value: "pork" },
    //     { view: "Turkey", value: "turkey" },
    //     { view: "Beef", value: "beef" },
    //     { view: "Coffee", value: "coffee-sweeteners" },
    // ];
    return (
        <div >
            {/* <div>
                <p>Choose users' product category</p>
                {radioOptions.map(({view: title, value: option}: any) => {
                    return (
                        <>
                            <input
                                type="radio"
                                value={option}
                                name={option}
                                checked = {option === userCategory}
                                onChange={(e) => onRadioChange(e)}
                            />
                            {title}<br/>
                        </>
                    );
                })}
            </div><br/> */}
            {/* <div>
                <label>
                User Quantity:
                <input
                    type="text"
                    name="quantity"
                    onChange={(e) => onUserqChange(e)}
                />
                </label>
            </div>
            <div>
                <label>
                Buddy Quantity:
                <input
                    type="text"
                    name="quantity"
                    onChange={(e) => onBuddyqChange(e)}
                />
                </label>
            </div><br/> */}
            {/* <button type="submit" onClick={handleClick}>Submit</button> */}
            {products.length !== 0 ? 
                (<>
                    <br/>
                    <p>Here are the recommended products you purchase!</p>
                    <ul className="product-list">
                        {products.map((product: Product) => (
                            <ProductCard product={product} key={product._id} />
                        ))}
                    </ul>
                </>
                )
                : <></>
            }
        </div>
    );
  };
  
  export default ProductRec;
  
