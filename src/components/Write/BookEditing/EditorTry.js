import React, { Component } from 'react'

import 'froala-editor/js/froala_editor.pkgd.min.js'
import 'froala-editor/css/froala_style.min.css'
import 'froala-editor/css/froala_editor.pkgd.min.css'
import 'froala-editor/css/plugins.pkgd.min.css'
import 'froala-editor/js/plugins.pkgd.min.js'
import 'froala-editor/js/languages/ko'
import 'froala-editor//css/themes/gray.min.css'


import FroalaEditorComponent from 'react-froala-wysiwyg';

export class EditorTry extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  
  render() {
    const config={
      imageUploadURL: 'api/create/upload_image',
      saveParam: 'content',
      width: 'auto',
      theme: "gray",
      tabSpaces: 4,
      toolbarContainer: '#toolbarContainer',
      attribution: false,
      charCounterCount: false,
      language: 'ko',
      toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'subscript', 'superscript', 
                       'fontFamily', 'fontSize', 'color', 
                       'align', 'formatOL', 'formatUL', 'outdent', 'indent',
                       'insertLink', 'insertImage', 'insertVideo', 'insertFile', 'insertTable', 
                       'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting',
                       'help', 'html', 'undo', 'redo'],
    }
    console.log('this.props.arrayForEditor', this.props.arrayForEditor)
    const editorList = this.props.arrayForEditor.map((item,index)=>{
      return (
                <div key={index}>
                  <label className="control-label">{item}</label>
                  <FroalaEditorComponent
                    tag='textarea'
                    config={config}
                    model={this.props['editor'+(index+1).toString()]}
                    onModelChange={this.props['handleModelChangeEditor'+(index+1).toString()]}
                  />
                </div>
        )
      })

    return (
      <>
      <div  id="editor">
        <div>
          <label className="control-label">사용자플래그</label>
          <input type="number"/>
        </div>
        {editorList}
        <button onClick={this.props.handleSubmit} id="saveButton">Save</button>
      </div>
      </>
    )
  }
}

export default EditorTry
