<template>
    <div>
      <div class="accessory-result-page accessory-page">
        <div class="container">
          <div class="filter-nav">
            <span class="sortby">Sort by:</span>
            <a href="javascript:void(0)" class="default cur">Default</a>
            <a href="javascript:void(0)" class="price" @click="sortGoods">Price <svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
            <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">Filter by</a>
          </div>
          <div class="accessory-result">
            <!-- filter -->
            <div class="filter stopPop" :class="{'filterby-show':filterBy}" id="filter">
              <dl class="filter-price">
                <dt>Price:</dt>
                <dd @click="setPriceFilter('All')"><a href="javascript:void(0)">All</a></dd>
                <dd v-for="(item,index) in priceFilter" @click="setPriceFilter(index)">
                  <a href="javascript:void(0)" @click="closePop">{{item.startPrice}}-{{item.endPrice}}</a>
                </dd>
              </dl>
            </div>

            <!-- search result accessories list -->
            <div class="accessory-list-wrap">
              <div class="accessory-list col-4">
                <ul>
                  <li v-for="(item,index) in goodsList">
                    <div class="pic">
                      <a href="#"><img v-lazy="'static/'+item.productImage" alt=""></a>
                    </div>
                    <div class="main">
                      <div class="name">{{item.productName}}</div>
                      <div class="price">{{item.salePrice}}</div>
                      <div class="btn-area">
                        <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                      </div>
                    </div>
                  </li>
                </ul>
                <div v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="30" class="load-more">
                  <img src="static/loading-svg/loading-spinning-bubbles.svg" alt="" v-show="loading">
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="overLay" v-show="overLayFlag" @click="closePop"></div>
    </div>
</template>
<script>
    export default{
        data(){
            return {
              goodsList:[],
              priceFilter:[
                {
                  'startPrice':'0.00',
                  'endPrice':'100.00'
                },
                {
                  'startPrice':'100.00',
                  'endPrice':'500.00'
                },
                {
                  'startPrice':'500.00',
                  'endPrice':'1000.00'
                },
                {
                  'startPrice':'1000.00',
                  'endPrice':'5000.00'
                }
              ],
              filterBy:false,
              overLayFlag:false,
              sortFlag:true,
              page:1,
              pageSize:8,
              busy:false,
              priceChecked:"All",
              loading:false
            }
        },
        mounted:function(){
          this.getGoodsList();
        }, 
        methods:{
          getGoodsList(flag){
              var params={
                page:this.page,
                pageSize:this.pageSize,
                sort:this.sortFlag?1:-1,
                priceLevel:this.priceChecked
              }
              this.loading=true;
              this.$axios.get('/goods',{params:params}).then((result)=>{
              let res=result.data;
              this.loading=false;
              if(res.status=="0"){
                if(flag){
                  this.goodsList=this.goodsList.concat(res.result.list);
                  if(res.result.count==0){
                    this.busy=true;
                  }else{
                    this.busy=false;
                  }
                }else{
                  this.goodsList=res.result.list;
                }
              }
              
            })
          },
          showFilterPop(){
            this.filterBy=true;
            this.overLayFlag=true;
          },
          closePop(){
            this.filterBy=false;
            this.overLayFlag=false;
          },
          sortGoods(){
            this.sortFlag=!this.sortFlag;
            this.page=1;
            this.getGoodsList();
          },
          loadMore() {
            this.busy = true;
       
            setTimeout(() => {
              this.page++;
              this.getGoodsList(true);
            }, 1000);
          },
          setPriceFilter(index){
            this.priceChecked=index;
            this.page=1;
            this.getGoodsList();
          },
          addCart(productId){
            this.$axios.post('/goods/addCart',{
              productId:productId
            }).then((res)=>{
              if(res.status==0){
                alert("success");
              }else{
                alert("msg:"+res.msg);
              }
            })
          }
        }
    }
</script>

<style>
  .overLay{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 200;
  }
  .load-more{
    text-align: center;
  }
</style>