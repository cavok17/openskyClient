import React, { useState, useEffect } from 'react';
import { Form, Input, Button,Select, Space } from 'antd';
import { BookOutlined } from '@ant-design/icons';
import './BookNaming.css'
import axios from 'axios'

const userId = localStorage.getItem('userId')

const { Option } = Select;
const HorizontalLoginForm = () => {
  
  const [form] = Form.useForm();
  const [, forceUpdate] = useState(); // To disable submit button at the beginning.
  const [ user, setUser ] = useState();
  const [ message, setMessage ] = useState();

  useEffect(() => {
    forceUpdate({});
  }, []);

  useEffect(() => {
    setUser({user:userId});
  }, []);

  // getAllTitle() {
  //   axios.get('api/create/get-all-title',{params: { userId: userId }})
  //   .then(res => {
  //     console.log(res)
  //     this.setState({
  //       bookTitle:res.data.bookTitle,
  //       likeTitle:res.data.likeTitle,
  //       category:res.data.category
  //     })
  //   })
  // }

  const [data, setData] = useState({});
  const [query, setQuery] = useState("react");

  useEffect(() => {
    let completed = false; 

    async function get() {
      const result = await axios.get('api/write/get-categorylist')
      if (!completed) setData(result.data.categories);
      console.log('category_list :',result.data.categories)
    }
    get();
    return () => {
      completed = true;
    };
  }, [query]); 

  const handleSubmit = (values) => {
    var url = '/api/write/create-book';
    var data = values;
    console.log(data)

    fetch(url, {
      method: 'POST', 
      body: JSON.stringify(data), 
      headers:{
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    .then(function(response){
      console.log(response)
      if(response.error === "동일한 이름의 책이 이미 존재합니다."){
        setMessage(response.error)
      } else {
        window.location.href = '/writing'
      }
    })
    .catch(error => console.error('Error:', error));
  }

  const onFinish = values => {
    handleSubmit(values)
  };

  console.log(data)

  return (
    <div className="naming_book_container">
      <div className="book_layout">
        <Form form={form} name="book_naming" layout="block" onFinish={onFinish}>
          <Form.Item
            className="category_select_naming"
            name={['category_id']}
            style={{width:"255px"}}
            label="카테고리"
            rules={[{ required: true, message: '카테고리를 선택해 주세요' }]}
          >
            <Select placeholder="카테고리를 선택해 주세요.">
              {data.length > 0 ? data.map((category)=>(
                                    <Option key={category._id} value={category.category_id}>{category.name}</Option>
                                  )) : 
                                  <Option value="미지정">0</Option>}
            </Select>
          </Form.Item>
          <Form.Item
            className="naming_input"
            name="book_title"
            label="책제목"
            style={{width:"255px"}}
            rules={[
              {
                required: true,
                message: '책제목을 입력해 주세요!!!',
              },
            ]}
          >
            <Input prefix={<BookOutlined className="site-form-item-icon" />} placeholder="책제목을 입력해 주세요" />
          </Form.Item>
          <Form.Item
            className="category_select_naming"
            name={['size']}
            style={{width:"255px"}}
            label="책 크기"
            rules={[{ required: true, message: '책 크기를 선택해 주세요' }]}
          >
            <Select placeholder="사이즈를 선택해 주세요.">
              <Option value="a4">a4</Option>
            </Select>
          </Form.Item>
          <div className="naming_buttons">
            <Space>
              <Form.Item>
                  <Button
                    className="naming_submit_button"
                    type="primary"
                    htmlType="submit"
                  >
                    취소
                  </Button>
              </Form.Item>
            
              <Form.Item>
                  <Button
                    className="naming_submit_button"
                    type="primary"
                    htmlType="submit"
                  >
                    시작
                  </Button>
              </Form.Item>
            </Space>
          </div>
        </Form>
        { message && <div style={{fontSize:"10px",color:"red"}}>※ {message}</div> }
      </div>
    </div>
  );
};

export default HorizontalLoginForm