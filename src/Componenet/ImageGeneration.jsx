import React, { useRef, useState } from 'react'
import './ImageGeneartion.css'
import image from '../Assests/default.webp';

const ImageGeneration = () => {
  const key=process.env.REACT_APP_API_KEY;

  const [image_url,setimage_url]=useState('/');
  const [imageblob,setimageblob]=useState(null);
  let inputRef=useRef(null);
  const [loading_active,set_loading]=useState(false);

  const generateImage=()=>{
    set_loading(true);
    if(inputRef.current.value==''){
      return ;
    }
    query(inputRef.current.value).then((response)=>{
      const objectURL=URL.createObjectURL(response);
      setimage_url(objectURL);
      setimageblob(response);
      set_loading(false);
    })
  }

  async function query(data) {
    const response = await fetch(
      "https://api-inference.huggingface.co/models/ZB-Tech/Text-to-Image",
      {
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(data),
      }
    );
    const result = await response.blob();
    return result;
  }

  const downloadBtn=()=>{
    if(image_url!=='/'){
      const link=document.createElement('a');
      const objectURL=URL.createObjectURL(imageblob);
      link.href=objectURL;
      link.download='generate_image.png';
      link.click();
      URL.revokeObjectURL(objectURL);
    }else{
      alert("No image to download!");
    }
  }

  return (
    <div className='image_generation'>
      <div className="container">
        <div className="heading">
          <h2>AI Image <span>Generator</span></h2>
        </div>

        <div className="image_section">
          <img src={image_url==='/'?image:image_url} alt="default image"/>
        </div>

        <div className={loading_active?'loading_section':'loading_none'} >
          <div className="loading_bar"></div>
          <p>Loading...</p>
        </div>
        <div className="search_box">
          <input type="text" ref={inputRef} name="input_box" id="input_box" placeholder='Describe the description of Image...' />
          <button onClick={()=>{generateImage()}}>Generate</button>
        </div>

        <div className="reset_and_download_button">
          <button onClick={()=>{setimage_url('/'); inputRef.current.value='';} }>Reset</button>
          <button onClick={()=>{downloadBtn()}}>Download</button>
        </div>
      </div>
    </div>
  )
}

export default ImageGeneration