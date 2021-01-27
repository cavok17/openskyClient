import React, { Component } from 'react';
import './LikeSectionContent.css'
import { EyeInvisibleOutlined, StarTwoTone, StarOutlined, EyeOutlined, ArrowUpOutlined,ArrowDownOutlined,EditOutlined} from '@ant-design/icons';
import CategorySettingModal from './CategorySettingModal'
import CategoryMoveModal from './CategoryMoveModal'
import DeleteBook from './DeleteBookModal'
import ChangeBookTitle from './ChangeBookTitle'
import { Empty,Switch } from 'antd';

import axios from 'axios'

class ListColumns extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }
  onChange = (checked) => {
    this.hideOrShowToggle(checked)
  }

  hideOrShowToggle = (checked) => {
    axios.post('api/book/change-hide-config',{
      hide_toggle : checked
    }).then(res => {
      this.props.updateHideOrShowState({hide_or_show:res.data.write_config[0].write_config.hide_or_show})
    })
  }
  
  render() { 
    console.log('checked:',this.props.hideOrShowToggleState)
    return ( 
      <ul className="like_list_columns">
        <li>카테고리 <CategorySettingModal updateState={this.props.updateState}
                                           category={this.props.category}/>
        </li>
        <li>책이름</li>
        <li>책이름<br/>변경</li>
        <li>구분</li>
        <li>저자</li>
        <li>총페이지</li>
        <li>최근30일<br/>작성카드</li>
        <li>카드종류</li>
        <li>생성일</li>
        <li>최근작성일</li>
        <li>카테고리<br/>이동</li>
        <li>즐겨찾기</li>
        <li>순서이동</li>
        <li>숨긴책보기{this.props.hideOrShowToggleState === false ? <><Switch size="small" onChange={this.onChange} />{this.props.hideOrShowToggleState}</> : <><Switch size="small" defaultChecked onChange={this.onChange} />{this.props.hideOrShowToggleState}</>}</li>
        <li>삭제</li>
      </ul> 
    );
  }
}

class ListContent extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      editBookTitle:false,
     }
  }

  editBookTitleHandler = () =>{
    this.setState(state => ({
      editBookTitle: !state.editBookTitle
    }));
  }
  titleChangeHandleClick = ()=> {
    this.setState(state => ({
      editBookTitle: !state.editBookTitle
    }));
  }
  
  saveBookIdSession = (value)=> {
    sessionStorage.setItem('book_id',value.book_id);
    window.location.href ="/editing"
    // console.log(value)
    // axios.post('api/book/start-write',{
    //   book_id:value.book_id
    // }).then(res => {
    //   console.log(res)
    //   window.location.href ="/editing"
    // })
  }

  eyeClickHandler = (value) =>{
    console.log('hide_or_show : ',value)
    axios.post('api/book/change-hide-or-show',{
      book_id : value.bookId,
      hide_or_show: value.value,
      seq_in_category: value.seq_in_category,
      seq_in_like: value.seq_in_like,
      category_id: value.category_id
    }).then(res => {
      this.props.updateState({value1: res.data.categorybooklist, value2: res.data.likebooklist})
    })
  }

  listOrderHandler = (value) => {
    console.log(value)
    if(value.from === "list"){
      axios.post('api/book/change-book-order',{
        book_id : value.bookId,
        action : value.action,
        seq_in_category:value.seq_in_category,
        category_id: value.category_id
      }).then(res => {
        console.log('순서조정후 res:', res.data)
        this.props.updateState({value1: res.data.categorybooklist, value2: res.data.likebooklist})
      })
    } else {
      axios.post('api/book/change-likebook-order',{
        book_id : value.bookId,
        action : value.action,
        seq_in_like:value.seq_in_like,
      }).then(res => {
        console.log('순서조정후 res:', res.data)
        this.props.updateState({value1: res.data.categorybooklist, value2: res.data.likebooklist})
      })
    }
    
  }

  onClickLike = (value) => {
    console.log("like clicked!!! ")
    if (value.value === 'true') {
      var like = 'false'
    } else {
      like = 'true'
    }
    console.log("book_id :",value.bookId)
    console.log("like :",like)
    axios.post('api/book/apply-likebook',{
      book_id : value.bookId,
      like: like
    }).then(res => {
      this.props.updateState({value1: res.data.categorybooklist, value2: res.data.likebooklist})
    })
  }
  
  render() { 
    const info = this.props.bookInfo;
    const toggleProps = this.props.hideOrShowToggleState;
    const date = info.time_created.slice(0,10)
    const update_date = info.time_created.slice(0,10)
    const renderLike = () => {
      if(info.hide_or_show === true){
          if(info.like === true) {
            return <StarTwoTone onClick={()=>this.onClickLike({value:'true',bookId:this.props.bookInfo._id})} twoToneColor="#52c41a" style={{fontSize:'14px'}}/>
          }else {
            return <StarOutlined onClick={()=>this.onClickLike({value:'false',bookId:this.props.bookInfo._id})} style={{fontSize:'14px'}}/>
          } 
        } else{
          return 
        }
      }
    return ( 
      <>
      {toggleProps === true ?
        <div className='like_list_contents'>
          <ul>
            <li>{this.props.currentCategory}</li>
            <li>{this.state.editBookTitle ? <ChangeBookTitle updateState={this.props.updateState}
                                                            bookTitle={info} 
                                                            category={this.props.category} 
                                                            onClick={this.titleChangeHandleClick}/> : <><span onClick={()=>this.saveBookIdSession({book_id:info._id})} >{info.title}/순서 : {info.seq_in_category}</span></>}</li>
            <li><EditOutlined onClick={this.editBookTitleHandler} style={{fontSize:'14px'}}/></li>
            <li>{info.type}</li>
            <li>{info.user_id}</li>
            <li>{info.num_pages}</li>
            <li>{info.num_cards.read.total}</li>
            <li>단면 {info.single_cards}장<br/>양면 {info.dual_cards}장</li>
            <li>{date}</li>
            <li>{update_date}</li>
            <li><CategoryMoveModal updateState={this.props.updateState} category={this.props.categoryTotal} bookTitle={info} /></li>
            <li>
              {renderLike()}
            </li>
            <li>{info.hide_or_show === true ? <><ArrowUpOutlined onClick={()=>this.listOrderHandler({action: 'up', from:'list',category_id: this.props.bookInfo.category_id._id, bookId: this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category})} style={{fontSize:'14px'}}/>
                                                 <ArrowDownOutlined onClick={()=>this.listOrderHandler({action: 'down', from:'list',category_id: this.props.bookInfo.category_id._id, bookId: this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category})} style={{fontSize:'14px'}}/></> : ''}
            </li>
            <li>{info.hide_or_show === false ? <EyeInvisibleOutlined onClick={()=>this.eyeClickHandler({value:true,bookId:this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category,seq_in_like:this.props.bookInfo.seq_in_like, category_id:this.props.bookInfo.category_id._id})} style={{fontSize:'14px'}}/>:
                                               <EyeOutlined onClick={()=>this.eyeClickHandler({value:false,bookId:this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category,seq_in_like:this.props.bookInfo.seq_in_like, category_id:this.props.bookInfo.category_id._id})} style={{fontSize:'14px'}}/>}</li>
            <li><DeleteBook bookTitle={info} updateState={this.props.updateState}  /></li>
          </ul>
        </div> : 
        <>{info.hide_or_show === true  ? 
            <div className='like_list_contents'>
                <ul>
                  <li>{this.props.currentCategory}</li>
                  <li>{this.state.editBookTitle ? <ChangeBookTitle updateState={this.props.updateState}
                                                                   bookTitle={info} 
                                                                   category={this.props.category} 
                                                                   onClick={this.titleChangeHandleClick}/> : <><span onClick={()=>this.saveBookIdSession({book_id:info._id})} >{info.title}/순서 : {info.seq_in_category}</span></>}</li>
                  <li><EditOutlined onClick={this.editBookTitleHandler} style={{fontSize:'14px'}}/></li>
                  <li>{info.type}</li>
                  <li>{info.user_id}</li>
                  <li>{info.num_pages}</li>
                  <li>{info.num_cards.read.total}</li>
                  <li>단면 {info.single_cards}장<br/>양면 {info.dual_cards}장</li>
                  <li>{date}</li>
                  <li>{update_date}</li>
                  <li><CategoryMoveModal updateState={this.props.updateState} category={this.props.categoryTotal} bookTitle={info} /></li>
                  <li>
                    {renderLike()}
                  </li>
                  <li>{info.hide_or_show === true ? <><ArrowUpOutlined onClick={()=>this.listOrderHandler({action: 'up', from:'list',category_id: this.props.bookInfo.category_id._id, bookId: this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category})} style={{fontSize:'14px'}}/>
                                                      <ArrowDownOutlined onClick={()=>this.listOrderHandler({action: 'down', from:'list',category_id: this.props.bookInfo.category_id._id, bookId: this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category})} style={{fontSize:'14px'}}/></> : ''}
                  </li>
                  <li>{info.hide_or_show === false ? <EyeInvisibleOutlined onClick={()=>this.eyeClickHandler({value:true,bookId:this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category,seq_in_like:this.props.bookInfo.seq_in_like, category_id:this.props.bookInfo.category_id._id})} style={{fontSize:'14px'}}/>:
                                                    <EyeOutlined onClick={()=>this.eyeClickHandler({value:false,bookId:this.props.bookInfo._id, seq_in_category:this.props.bookInfo.seq_in_category,seq_in_like:this.props.bookInfo.seq_in_like, category_id:this.props.bookInfo.category_id._id})} style={{fontSize:'14px'}}/>}</li>
                  <li><DeleteBook bookTitle={info} updateState={this.props.updateState}  /></li>
                </ul>
              </div> 
          : ''} 
        </>
      }
      
      </>
     );
  }
}
class CategoryListContainer extends Component {
  constructor(props) {
    super(props);
    this.state = { 
     };
  }
  
  render() {
    if(this.props.category.book_ids.length > 0){
      var bookList = this.props.category.book_ids.map((book_title) =>
        {
          if(book_title){
           return <ListContent category={this.props.category} 
                      updateState={this.props.updateState}
                      currentCategory={this.props.categoryName}
                      key={book_title._id} 
                      categoryTotal={this.props.categoryTotal}
                      bookInfo={book_title} 
                      hideOrShowToggleState={this.props.hideOrShowToggleState}/>
          } else{
            return <div>hello</div>
          }
        
        }
      )
    } else {
      bookList = this.props.category.name
    }
    
    return (

      <div className="each_category_container">{bookList}</div>

    );
  }
}

class ListSectionContent extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      
     };
  }

  render() { 
    if(this.props.category){
      var categoryList = this.props.category.map((category)=>(
        <CategoryListContainer key={category._id} 
                              updateState={this.props.updateState}
                              categoryName={category.name} 
                              category={category} 
                              categoryTotal={this.props.category}
                              hideOrShowToggleState={this.props.hideOrShowToggleState}/>
      ))
    } else {
      categoryList = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
    }
    
    return ( 
      <div className="like_list_container">
        <ListColumns 
                    updateState={this.props.updateState}
                    updateHideOrShowState={this.props.updateHideOrShowState}
                    hideOrShowToggleState={this.props.hideOrShowToggleState}
                    changeCategoryHandler={this.props.changeCategoryHandler} 
                    category={this.props.category}/>
        {categoryList}
      </div>
     );
  }
}
 
export default ListSectionContent;