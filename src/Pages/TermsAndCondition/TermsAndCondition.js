import React,{useEffect, useState,useContext} from 'react'
import useWindowDimensions from '../../Helpers/useWindowDimensions';
import FileViewer from 'react-file-viewer';

import terms from '../../Assets/Terms of Use.docx';
import privacy from "../../Assets/CryptoWins Privacy Policy.docx";
const type = "docx";

function TermsAndCondition() {
    const [type, setType]=useState(1);
    const {width} = useWindowDimensions()
    return (
        <div style={{minHeight:"100vh",background:"#1E1E2B"}}>
            <div style={{marginTop:"50px", width: width < 500 ? "350px" :"500px", margin:"0 auto", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap"}}>
                <span onClick={() => setType(1)} style={{borderRadius:"10px",cursor:"pointer", padding:"10px",background: type === 1 ? "#CB52E3": "#707070",color:"#fff", fontSize:"20px", fontWeight:"600"}}>
                    Privacy Policy
                </span>
                <span onClick={() => setType(2)} style={{borderRadius:"10px",cursor:"pointer",padding:"10px",background: type === 2 ? "#CB52E3": "#707070",color:"#fff", fontSize:"20px", fontWeight:"600"}}>
                    Terms & Conditions
                </span>
            </div>
            <div style={{display:"flex", alignItems:"center", justifyContent:"center",flexDirection:"column",marginTop:"20px"}}>
            {type === 1 && (
            
            <FileViewer
            fileType={"docx"}
            filePath={privacy}
            onError={(error)=>console.log("errir",error)}
            />
            )
                
    }
          {type === 2 && (

            <FileViewer
            fileType={"docx"}
            filePath={terms}
            onError={()=>console.log("errir")}
            />
          )
                
    }
        </div>
        </div>
    )
}

export default TermsAndCondition
