import React, {Component} from 'react';
import { Table } from 'antd';
import RequestModal from './RequestModal'
import DefaultButton from '../../../styledComponents/defaultButton'
import axios from 'axios'

class BookList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          category : [],
          isModalVisible:false,
          visible_array:[{book_id:'', visible:false}],
         }
      }
    
    showModal = () => {
      this.setState(prevState=>({
        visible_array:{...prevState.visible_array, isModalVisible:true}
      }));
    };
  
    handleOk = () => {
      this.setState(prevState=>({
        visible_array:{...prevState.visible_array, isModalVisible:false}
      }));
    };
  
    handleCancel = () => {
      this.setState(prevState=>({
        visible_array:{...prevState.visible_array, isModalVisible:false}
      }));
    };

    getStudyData = (value) =>{
        this.setState({
          visible_array:{book_id:value, isModalVisible:true}
        })
        this.showModal()        
    }

    componentDidMount() {
        sessionStorage.removeItem("book_ids")
        sessionStorage.setItem('current_seq',0);
        
        this.showTitle()
    }

    showTitle() {
        axios.get('api/book/get-booklist')
        .then(res => {
            this.setState({
            category:res.data.categorybooklist
            })
        })
    }

  
  render() {
    console.log('state : ',this.state.visible_array)
    const columns = [
      {
        title: '카테고리',
        dataIndex: 'category',
      },
      {
        title: '책이름',
        dataIndex: 'book_title',
      },
      {
        title: '구분',
        dataIndex: 'origin',
      },
      {
        title: '저자',
        dataIndex: 'author',
      },
      {
        title: '총페이지',
        dataIndex: 'total_page',
      },
      {
        title: '학습카드총합',
        dataIndex: 'total_cards',
        render: (text, record) => {
            if(record){
                return <><span>total:{text}</span> / <span>flip:{record.flip_card_total} / read:{record.read_card_total}</span></>
            } 
          }
      },
      {
        title: '생성일',
        dataIndex: 'time_created',
      },
      {
        title: '최근작성일',
        dataIndex: 'recent_edit',
      },
      {
        title: '진행현황',
        dataIndex: 'submit_progress',
      },
      {
        // title: '책 등록하기',
        dataIndex: 'key',
        render: (text, record) => {
          if(record){
              return (<><DefaultButton size="small" onClick={()=>this.getStudyData(record.book_id)} >판매요청</DefaultButton>
                      <RequestModal 
                        book_id={record.book_id}
                        isModalVisible={this.state.visible_array}
                        showModal={this.showModal}
                        handleCancel={this.handleCancel}
                        handleOk={this.handleOk}
                        showCandiBookList={this.props.showCandiBookList}
                    /></>)
          } 
        }
      },
    ];


    if(this.state.category){
      console.log("here?")
      var plz = []
      this.state.category.map(book => book.book_ids.map((item)=> plz.push(item)))
      console.log(plz)
      var data = plz.map(book => {
          if(book.type === "self"){
            return ({
                key: book._id,
                book_id: book._id,
                category: book.category_id.name,
                book_title : book.title,
                origin:book.type,
                author:book.author,
                total_page:'00장',
                total_cards:book.num_cards.total.total,
                time_created:book.time_created,
                recent_edit:book.time_created,
                submit_progress:'',
                flip_card_total:book.num_cards.flip.total,
                read_card_total:book.num_cards.read.total,
            })
          } else {
            return null
          }
        })
      console.log(data)
      
    }
    
    if(this.state.selected_book) {
      console.log('state value:',this.state.selected_book)
    }

    return (
      <div>
        <Table
          className='study_table_list'
          columns={columns}
          dataSource={data}
          pagination={false}
          size='small'
        />
      </div>
    );
  }
}

export default BookList;