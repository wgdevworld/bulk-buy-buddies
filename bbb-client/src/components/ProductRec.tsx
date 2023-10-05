import { list } from "postcss";
import React, { useState, useEffect, Fragment } from "react";

const ProductRec = () => {
    const [userCategory, setUserCategory] = useState<String>('');
    const [userQuantity, setUserQuantity] = useState<String>('');
    const [buddyQuantity, setBuddyQuantity] = useState<String>('');
    const [products, setProducts] = useState();

    const handleClick = async () => {
        try {
            const response = await fetch(
                `http://127.0.0.1:5000/fetchSimilarProducts?userCategory=${userCategory}&userQuantity=${userQuantity}&buddyQuantity=${buddyQuantity}`
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
    const onRadioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserCategory(e.currentTarget.value);
    };
    const onUserqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserQuantity(e.currentTarget.value);
    };
    const onBuddyqChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setBuddyQuantity(e.currentTarget.value);
    };
    const radioOptions = [
        { view: "Chicken", value: "chicken" },
        { view: "Pork", value: "pork" },
        { view: "Turkey", value: "turkey" },
        { view: "Beef", value: "beef" },
        { view: "Coffee", value: "coffee" },
    ];
    return (
        <div>
            <div>
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
                            {title}
                        </>
                    );
                })}
            </div>
            <div>
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
            </div>
            <button type="submit" onClick={handleClick}>Submit</button>
            {products ? 
                (<>
                    <p>form submission complete, displaying product list below</p>
                    
                </>
                
                )
                : <></>
            }
        </div>
    );
  };
  
  export default ProductRec;
  