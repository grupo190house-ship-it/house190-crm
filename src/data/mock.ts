import type { Purchase } from "@/types/domain";
export const purchases: Purchase[] = [
 {id:"TA-91021",customerName:"Mariana Santos",phone:"5573998761234",time:"21:14",total:68.9,channel:"Delivery",products:[{id:"p1",name:"American Smash",amount:2,totalPrice:58,brand:"HOUSE190"},{id:"p2",name:"Fritas P",amount:1,totalPrice:10.9,brand:"HOUSE190"}],brand:"HOUSE190",eligible:true,status:"Pronto para revisar"},
 {id:"TA-91018",customerName:"Rafael Oliveira",phone:"5573998429876",time:"20:48",total:39.9,channel:"Balcão",products:[{id:"p3",name:"X-Tudo Especial",amount:1,totalPrice:39.9,brand:"XTUDO"}],brand:"XTUDO",eligible:false,reason:"Marca X-Tudo",status:"Excluído"},
 {id:"TA-91005",customerName:"Camila Andrade",phone:"5573997154832",time:"19:32",total:84.5,channel:"Delivery",products:[{id:"p4",name:"House Bacon",amount:1,totalPrice:39.9,brand:"HOUSE190"},{id:"p3",name:"X-Tudo Especial",amount:1,totalPrice:34.9,brand:"XTUDO"}],brand:"MIXED",eligible:false,reason:"Pedido com marcas mistas",status:"Revisão necessária"},
 {id:"TA-90998",customerName:"João Victor",phone:"5573996678451",time:"18:57",total:42.9,channel:"Totem",products:[{id:"p5",name:"Cheddar Crispy",amount:1,totalPrice:42.9,brand:"HOUSE190"}],brand:"HOUSE190",eligible:false,reason:"Contato há 3 dias",status:"Frequency cap"},
 {id:"TA-90984",customerName:"Ana Luiza",time:"18:21",total:31.9,channel:"Mesa",products:[{id:"p6",name:"Smash Clássico",amount:1,totalPrice:31.9,brand:"HOUSE190"}],brand:"HOUSE190",eligible:false,reason:"Telefone ausente",status:"Excluído"},
 {id:"TA-90973",customerName:"Pedro Henrique",phone:"5573999942018",time:"17:46",total:56.8,channel:"Delivery",products:[{id:"p7",name:"Burger do Mês",amount:1,totalPrice:56.8,brand:"UNMAPPED"}],brand:"UNMAPPED",eligible:false,reason:"Produto sem classificação",status:"Revisão necessária"},
];
export const products = [
 {id:"1938401",name:"American Smash",category:"Burgers",price:29,brand:"HOUSE190",available:true}, {id:"1938402",name:"House Bacon",category:"Burgers",price:39.9,brand:"HOUSE190",available:true},
 {id:"1938403",name:"X-Tudo Especial",category:"Lanches",price:39.9,brand:"XTUDO",available:true}, {id:"1938404",name:"Fritas P",category:"Acompanhamentos",price:10.9,brand:"HOUSE190",available:true},
 {id:"1938405",name:"Burger do Mês",category:"Novidades",price:44.9,brand:"UNMAPPED",available:true}, {id:"1938406",name:"Refrigerante lata",category:"Bebidas",price:7,brand:"IGNORE",available:true},
] as const;
