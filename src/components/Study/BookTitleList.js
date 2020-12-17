import React, { Component } from 'react';
import { Space, Tabs } from 'antd';
import "./BookTitleList.css"
import IndexTree from "./IndexTree"
import {ArrowUpOutlined,ArrowDownOutlined} from '@ant-design/icons';
import SelectedIndexCardCount from './SelectedIndexCardCount'

const { TabPane } = Tabs;

class BookTitleList extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  
  render() {
    console.log('from :', this.props.books)
    const bookList = this.props.books.map((book)=> 
      <TabPane tab={
        <span>
          <Space>
          {book.title}
          <ArrowUpOutlined onClick={()=>this.props.onClickUp(book.book_id)}/>
          <ArrowDownOutlined onClick={()=>this.props.onClickDown(book.book_id)}/>
          </Space>
        </span>
        } key={book.book_id}>
          <div style={{padding:'10px', fontSize:"11px", backgroundColor:"#5c89cf", borderBottom:"10px solid #b1c6ec"}}><SelectedIndexCardCount /></div>
        <IndexTree onSelect={this.props.onSelect} book_id={book.book_id} book={book.index_ids}/>
      </TabPane>
      )
    return (
        <Tabs style={{height:"80%",paddingLeft:"10px"}} className="study_next_page_tabs" tabPosition="left">
          {bookList}
        </Tabs>
    );
  }
}

export default BookTitleList;