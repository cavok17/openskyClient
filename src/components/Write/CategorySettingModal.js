import React, { Component } from 'react';
import { Modal, Popover,Form, Input, Button, Space  } from 'antd';
import './CategorySettingModal.css'
import { SettingOutlined, PlusOutlined,ArrowUpOutlined,ArrowDownOutlined,EditOutlined} from '@ant-design/icons';
import ChangeCategoryName from './ChangeCategoryName'
import DeleteCategory from './DeleteCategory'
import axios from 'axios'
// const [form] = Form.useForm();

class CategoryList extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      inputArea : false,
      newInput : false
     };
  }  

  onFinish = value => {
    this.addCategory(value)
    this.newInputVisible()
  };

  addCategory = (value) => {
    axios.post('api/book/create-category',{
      prev_category_id : this.props.category.category_id,
      prev_category_seq : this.props.category.seq,
      new_category : value.newCategory,
    }).then(res => {
      if(res.data.error === "동일한 이름의 카테고리명이 이미 존재합니다."){
        this.setState({
          message:res.data.error
        })
        alert(this.state.message)
      } else {
        this.props.updateState({value1: res.data.categorybooklist, value2: res.data.likebooklist})
      }
    })
  }

  categoryListOrder = (value) => {
    console.log('category_id:',value.categoryId)
    console.log('action:',value.action)
    console.log('seq:',value.categorySeq)
    axios.post('api/book/change-category-order',{
      category_id : value.categoryId,
      action : value.action,
      seq:value.categorySeq
    }).then(res => {
      this.props.updateState({value1: res.data.categorybooklist, value2: res.data.likebooklist})
    })
  }

  
  
  inputAreaVisible = () =>{
    this.setState(state => ({
      inputArea: !state.inputArea
    }));
  }
  newInputVisible = () =>{
    this.setState(state => ({
      newInput: !state.newInput
    }));
  }
  render() {
    
    const text = <span>새로운 카테고리 이름을 입력해 주세요.</span>;
    const content = (
      <Form
          layout={'inline'}
          size="small"
          onFinish={this.onFinish}
          className="change_book_title_input_form"
        >
          <Space>
          <Form.Item name={['newCategory']} rules={[{ required: true }]} >
            <Input placeholder='' />
          </Form.Item>
          <Form.Item className="change_book_title_buttons">
            <Button type="primary" htmlType="submit">완료</Button>
            <Button type="primary" onClick={this.newInputVisible}>취소</Button>
          </Form.Item>
          </Space>
        </Form>
    );
    const bookListInCategory = this.props.category.book_ids
    const bookList = bookListInCategory.map((book)=>(
      <span>{book.title}, </span>
    ))
    console.log('hello there :',this.props.category)
    return(
        <div className="category_setting_content">
          <ul>
            <li>
              <Popover placement="rightTop" title={text} visible={this.state.newInput} content={content} trigger="click">
                <PlusOutlined onClick={this.newInputVisible} style={{fontSize:'14px'}} />
              </Popover>
            </li>
            <li>{this.state.inputArea ? <ChangeCategoryName updateState={this.props.updateState} 
                                                            vi={this.state.inputArea} 
                                                            inputAreaVisible={this.inputAreaVisible} 
                                                            category={this.props.category} /> : <>{this.props.category.name}/순서:{this.props.category.seq} </>}</li>
            <li>
              {this.props.category.name === '(미지정)' ? '' :<EditOutlined onClick={this.inputAreaVisible} style={{fontSize:'14px'}}/>}
            </li>
            <li>
              {this.props.category.name === '(미지정)' ? '' : <><ArrowUpOutlined onClick={()=>this.categoryListOrder({action: 'up', categoryId: this.props.category._id, categorySeq: this.props.category.seq})} style={{fontSize:'14px'}}/>
                                                               <ArrowDownOutlined onClick={()=>this.categoryListOrder({action: 'down', categoryId: this.props.category._id, categorySeq: this.props.category.seq})} style={{fontSize:'14px'}}/></>}
            </li>
            <li>{this.props.category.name === '(미지정)' ? '' :<DeleteCategory updateState={this.props.updateState} categoryTotal={this.props.categoryTotal} category={this.props.category} />}</li>
            <li>{bookList.length}</li>
            <li>{bookList}</li>
          </ul>
        </div>
    )
  }
}



class CategoryModal extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      visible: false
     };
  }

  render() {
    if(this.props.category){
      var categoryList = this.props.category.map((category)=>(
        <CategoryList updateState={this.props.updateState}
                      key={category._id} 
                      categoryTotal={this.props.category} 
                      category={category}/>
      ))
    } else {
      var categoryList = 'none'
    }
    
    
    return (
      <>
        <SettingOutlined  onClick={() => this.setState({visible:true})} style={{fontSize:'14px'}}/>
        <Modal
          title={[<SettingOutlined  onClick={() => this.setState({visible:true})} style={{fontSize:'14px'}}/>,<span style={{fontSize:"12px"}}> 카테고리 설정</span>]}
          visible={this.state.visible}
          onCancel={() => this.setState({visible:false})}
          width={1000}
          footer={null}
          style={{ top: 70 }}
        >
          <div className="category_setting_columns">
            <ul>
              <li>추가</li>
              <li>카테고리 명</li>
              <li>이름변경</li>
              <li>표시순서<br/>변경</li>
              <li>삭제</li>
              <li>총 책권수</li>
              <li>책 제목모음</li>
            </ul>
          </div>
          {categoryList}
        </Modal>
      </>
    )
  }
}

export default CategoryModal