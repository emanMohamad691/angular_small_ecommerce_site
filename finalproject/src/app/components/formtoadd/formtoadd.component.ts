// (https?:)?//?[^\'"<>]+?\.(jpg|jpeg|gif|png)
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MyproductsService } from './../../services/myproducts.service';

@Component({
  selector: 'app-formtoadd',
  templateUrl: './formtoadd.component.html',
  styleUrls: ['./formtoadd.component.css']
})
export class FormtoaddComponent implements OnInit {
  formerror:string="";
  productId:any;
  valueToUpdate:any;
  base64:any
  constructor(private router:Router , private productServices:MyproductsService, private activatedroute:ActivatedRoute){
    this.productId=this.activatedroute.snapshot.params['id']
  }

ngOnInit(): void {
  this.productServices.getProductById(this.productId).subscribe((response:any)=>{
    console.log(response)
    this.addform= new FormGroup({
      src:new FormControl(response.src,[Validators.required]),
      name:new FormControl(response.name,[Validators.required,Validators.pattern("^[a-zA-Z_ ]*$")]),
      desc:new FormControl(response.desc,[Validators.required, Validators.pattern("^[a-zA-Z_ ]*$")]),
      price:new FormControl(response.price,[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
      quantity:new FormControl(response.quantity,[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")])
    });
    this.base64=response.src
  })
}

getImagePath(event:any){
const file =event.target.files[0];
const reader =new FileReader();
reader.readAsDataURL(file)
reader.onload=()=>{
this.base64=reader.result
this.addform.get('src')?.setValue(this.base64)
}
}
get getsrc(){
  return this.addform.controls.src;
};

get getname(){
  return this.addform.controls.name;
};

get getdesc(){
  return this.addform.controls.desc;
};

get getprice(){
  return this.addform.controls.price;
};

get getquantity(){
  return this.addform.controls.quantity;
}
addform= new FormGroup({
  src:new FormControl("",[Validators.required]),
  name:new FormControl("",[Validators.required,Validators.pattern("^[a-zA-Z_ ]*$")]),
  desc:new FormControl("",[Validators.required, Validators.pattern("^[a-zA-Z_ ]*$")]),
  price:new FormControl("",[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")]),
  quantity:new FormControl("",[Validators.required,Validators.pattern("^(0|[1-9][0-9]*)$")])
});

addproduct(){
  if(this.addform.status=="VALID"&& this.productId){
    this.productServices.editProduct(this.productId,this.addform.value).subscribe((Response)=>{
      console.log(Response)
      this.router.navigate(['/dashboard'])
    })
  } else if(this.addform.status=="VALID"){
    this.productServices.addProduct(this.addform.value).subscribe((Response)=>{
      console.log(Response);
      this.router.navigate(['/dashboard'])
     });

    }else{
    console.log("unvalid")
    console.log(this.addform)
    this.formerror="some thing error";
    console.log(this.formerror)
    
  }
}

}
