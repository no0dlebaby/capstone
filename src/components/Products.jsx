import React, {useState, useEffect} from 'react'


function Products(){
    const [products, setProducts] = useState([])

    useEffect(()=>{
        const fetchProducts = async()=>{
            const response= await axios.get('http://localhost:8080/api/products')
            setProducts(response.data)
        }
        fetchProducts()
    },[])
    return(
        <div>
            <h1>products</h1>
            <ul>
                {products.map(product => (
                <li key={product.id}>
                    {product.name} - ${product.price}
                </li>
                ))}
            </ul>
        </div>
    )
}

export default Products