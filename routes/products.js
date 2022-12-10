import express from "express"
import ProductsService from "../utils/productsService.js"
import {faker} from "@faker-js/faker";
const  products = express.Router();
const {commerce, image} = faker;
faker.locale = "es";
import {UsuarioModel} from "../models/Usuario.js";

const getUser=  async (id) => {
    const user = await UsuarioModel.findById(id)
    console.log(user)
    return user
}


const checkLogin = (request,response,next)=>{
    console.log("authOk", request.isAuthenticated())
    if(request.isAuthenticated()){
        next();
    } else{
        response.redirect("/login");
    }
}

products.get("/", checkLogin, async (request, response)=>{
    let user = {name: ""}
    let userDB = await getUser(request.session.passport.user)
    user.name = userDB.name
    console.log(user)
    response.render("form", {user})
})

products.post("/productos", checkLogin, async(request,response)=>{
    const newProduct = request.body;
    const productos = await ProductsService.agregarProducto(newProduct);
    console.log(productos)
    response.redirect("/")
})

products.get("/api/productos-test", checkLogin, async (request, response)=>{
    let user = {name: ""}
    let userDB = await getUser(request.session.passport.user)
    user.name = userDB.name
    console.log(user)
    let productos=[];
    for(let i=0;i<5;i++){
        
        productos.push(
            {
                title: commerce.productName(),
                thumbnail: image.imageUrl(100,100,"product",true),
                price: commerce.price()
            }
        )
    }
   response.render("test", {productos,user})
})
    

export default products