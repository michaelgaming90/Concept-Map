import "./../css/Description.css";
import React, { useRef, useEffect, useState } from "react";

function Description(Props)
{
	const Div = useRef(null);
	const TextArea = useRef(null);
	const TextAreas = useRef([]);
	const [Class, Set_Class] = useState(() => `Description_Div`);

	useEffect(() => 
	{
  	Adjust_TextArea();
	}, [Props.Text]);

	useEffect(() =>
	{
		if(!Props.Description_State) 
		{
			if(!Div.current) return;
			Set_Class(() => `Description_Div Unmounted`);
		}
		else
		{
			if(!Div.current) return;
			Set_Class(() => `Description_Div Mounted`);
			Div.current.style.display = "block";
		}
	}, [Props.Description_State])

	function Display()
	{
	  if(!Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index]) return null;
  	return Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index]
  	.Descriptions.map((Description, Index) => 
    	(<textarea onClick = {(e) => {if(Props.Edit_Text_Mode)Edit_Text(e, Index);
			}}readOnly ref = {(Element) => TextAreas.current[Index] = Element} key = {Index} value = {`- ${Description}`} className = "Descriptions"/>)
  	)
	}

	function Adjust_TextArea()
	{
  	TextAreas.current.forEach(TextArea => 
  	{
			if(!TextArea) return;
    	TextArea.style.height = 'auto';
    	TextArea.style.height = `${TextArea.scrollHeight}px`;
  	})

		if(!TextArea.current) return;
		TextArea.current.style.height = 'auto';
		TextArea.current.style.height = `${TextArea.current.scrollHeight}px`;
	}

	function Edit_Text(e, Index)
	{
		Props.TextArea_Input.current.value = e.target.value.slice(2);
		Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Descriptions.splice(Index, 1);
		localStorage.setItem("Data", JSON.stringify(Props.Data));
		Props.Set_Text(() => Props.TextArea_Input.current.value);
		Props.Set_Data(() => Props.Data);
		Props.Set_Edit_Text_Mode(() => false);
		Props.Set_Force_Render_State((Prev) => !Prev);
	}

	return(
		<div ref = {Div} className = {Class} onClick = {() => Props.Set_Menu_Mode(() => "Description_Menu")}>
			<label className = "Title">
				{
					Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index] &&
					Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Title
				}
			<button className = "Display_Description" onClick = {() => Props.Set_Description_State(() => false)}>
        -
      </button>
			</label>
			{Props.Switch_Value?
				<>
					{Display()}
					<textarea ref = {TextArea} readOnly value = {`- ${Props.Text}`}/>
				</>:
					Props.Data[Props.Subject_Index].Subject_Info[Props.Topic_Index].Topic_Info[Props.Information_Index].Descriptions.length !== 0 ? Display(): <textarea readOnly value = {"- No Description"}/>
			}
			{Adjust_TextArea()}
		</div>);
}

export default Description;