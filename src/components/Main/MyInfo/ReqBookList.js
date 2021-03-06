import React, {Component} from 'react';
import { Table } from 'antd';
import DefaultButton from '../../../styledComponents/defaultButton'
import axios from 'axios'

class ReqBookList extends Component {
    constructor(props) {
        super(props);
        this.state = { 
          category : [],
          isModalVisible:false
         }
      }
    
    showModal = () => {
        this.setState({
            isModalVisible:true
        })
      }
    
    handleOk = () => {
        this.setState({
            isModalVisible:false
        })
      }
    
    handleCancel = () => {
        this.setState({
            isModalVisible:false
        })
      }
    componentDidMount() {
        sessionStorage.removeItem("book_ids")
        sessionStorage.setItem('current_seq',0);
    }

    permitSellClick(book_id) {
        axios.post('api/bookstore/permit-book-sell',{
            candi_id: book_id,
          }).then(res => {
            console.log(res.data)
          })
    }

  
  render() {
    console.log('really?', this.props.candibooklist)
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
              return <DefaultButton size="small" onClick={()=>this.permitSellClick(record.book_id)} >판매승인</DefaultButton>
          } 
        }
      },
    ];


    if(this.props.candibooklist){
      console.log("here?")
      var plz = []
    //   var categoryArray = this.state.category.map(book => book.book_ids.map((item)=> plz.push(item)))
      this.props.candibooklist.map(book =>  plz.push(book) )
      console.log(plz)
      var data = plz.map(book =>{
        //   if(book.type === "self"){
          if(book){
            return ({
                key: book._id,
                book_id: book._id,
                category: '카테고리', //book.category_id.name,
                book_title : book.title,
                origin: '정보'           ,//book.type,
                author: '정보'           ,//book.author,
                total_page:'00장',
                total_cards:'정보',  //book.num_cards.total.total,
                time_created:book.time_created,
                recent_edit:book.time_created,
                submit_progress:'',
                flip_card_total:'정보',  //book.num_cards.flip.total,
                read_card_total:'정보',  //book.num_cards.read.total,
            })
          } else {
            return null
          }
        })
      console.log(data)
      
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

export default ReqBookList;