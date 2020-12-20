import React, { Component } from 'react';
import { Space, Tabs,Input,Divider,Tooltip  } from 'antd';
import "./BookTitleList.css"

const { TabPane } = Tabs;

class CardTypeSettingTabs extends Component {
  constructor(props) {
    super(props);
    this.state = {  };
  }
  
  render() {
    console.log('from :', this.props.card_type)
    const flexStyle = {
        display:"flex", 
        justifyContent:"space-between"
    }
    const bookList = this.props.card_type.map((card_type)=> {
        if(card_type.type === "read"){
            var type = "학습 - 읽기카드"
        } else if(card_type.type === "flip_normal"){
            type = "학습 - 뒤집기카드"
        }else if(card_type.type === "none"){
            type = "기타 - 비학습카드"
        }else if(card_type.type === "share"){
            type = "기타 - 공통지문카드"
        }
        const face1 = card_type.nick_of_row.face1.map((face1,index)=>
            <ul style={flexStyle}>
                <li>앞면-{index + 1}행</li>
                <li>{face1}</li>
                <li><Input size="small" style={{width:"150px", fontSize:"11px"}} placeholder={face1}/></li>
            </ul>
        )
        const selection = card_type.nick_of_row.selection.map((selection,index)=>
            <ul style={flexStyle}>
                <li>보기-{index + 1}행</li>
                <li>{selection}</li>
                <li><Input size="small" style={{width:"150px", fontSize:"11px"}} placeholder={selection}/></li>
            </ul>
        )
        const face2 = card_type.nick_of_row.face2.map((face2,index)=>
            <ul style={flexStyle}>
                <li>뒷면-{index + 1}행</li>
                <li>{face2}</li>
                <li><Input size="small" style={{width:"150px", fontSize:"11px"}} placeholder={face2}/></li>
            </ul>
        )
        console.log(face1)
     return <TabPane tab={
        <span>
          <Space>
          {type} - {card_type.name}
          </Space>
        </span>
        } key={card_type._id}>
          <div style={{padding:'10px', fontSize:"11px"}}>
              <ul style={flexStyle}>
                  <li>행위치</li>
                  <li>행이름</li>
                  <li>행 별칭</li>
              </ul>
              <Divider />
              <ul style={flexStyle}>
                  <li>제작자플래그</li>
                  <li>B</li>
                  <li>제작자플래그</li>
              </ul>
              <Divider />
              {face1}
              <Divider dashed />
              {selection}
              <Divider />
              {face2}
          </div>
      </TabPane>
    })
    return (
        <Tabs style={{height:"80%",paddingLeft:"10px"}} className="study_next_page_tabs" tabPosition="left">
          {bookList}
        </Tabs>
    );
  }
}
 

export default CardTypeSettingTabs;