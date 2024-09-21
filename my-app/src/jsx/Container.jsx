import Description from "./Description.jsx";
import Settings from "./Settings.jsx";
import Overview from "./Overview.jsx";
import Menu from "./Menu.jsx";
import Information_Choosing from "./Information_Choosing.jsx";
import Authentication from "./Authentication.jsx";
import React, { useState, useRef } from "react";
import "./../css/Container.css";

function Container()
{
  const [Force_Render_State, Set_Force_Render_State] = useState(() => false);
  const [Data, Set_Data] = useState(() => JSON.parse(localStorage.getItem("Data")));
  const [Subject_Index, Set_Subject_Index] = useState(() => 0);
	const [Topic_Index, Set_Topic_Index] = useState(() => 0);
	const [Information_Index, Set_Information_Index] = useState(() => 0);
	const [Description_State, Set_Description_State] = useState(() => false);
  const [Switch_Value, Set_Switch_Value] = useState(() => false);
	const [Menu_Mode, Set_Menu_Mode] = useState(() => "Description_Menu");
	const [Text, Set_Text] = useState(() => "");
	const [Choosen_Option, Set_Choosen_Option] = useState(() => {});
	const [Choosen_Description, Set_Choosen_Description] = useState(() => "");
	const [Edit_Text_Mode, Set_Edit_Text_Mode] = useState(() => false);
	const [Edit_Label_Mode, Set_Edit_Label_Mode] = useState(() => false);
	const [Authentication_State, Set_Authentication_State] = useState(() => true);
	const [Admin_State, Set_Admin_State] = useState(() => false);
	
	const TextArea_Input = useRef(null);

	if(!Data || Data.length === 0 || Authentication_State) 
		return (
			<div className = "Container_Div">
				<Authentication 
				Admin_State = {Admin_State}
				Set_Data = {Set_Data} 
				Set_Admin_State = {Set_Admin_State}
				Set_Authentication_State = {Set_Authentication_State}/>
			</div>)
	if
	(
		Data[Subject_Index].Subject_Info[Topic_Index].Topic_Info.length !== 0 && 
		Data[Subject_Index].Subject_Info[Topic_Index].Topic_Info[Data[Subject_Index].Subject_Info[Topic_Index].Topic_Info.length - 1].Title
	)
  return(
    <div className = "Container_Div">
      < Overview 
				Set_Information_Index = {Set_Information_Index} 
				Set_Description_State = {Set_Description_State}
				Set_Menu_Mode = {Set_Menu_Mode}
				Set_Edit_Label_Mode = {Set_Edit_Label_Mode}
				Set_Data = {Set_Data}
				Switch_Value = {Switch_Value}
				Data = {Data}  
				Edit_Label_Mode = {Edit_Label_Mode}
				Subject_Index = {Subject_Index} 
				Topic_Index = {Topic_Index}
			/>
      {Admin_State &&
			<	Settings 
				Set_Switch_Value = {Set_Switch_Value} 
				Set_Description_State = {Set_Description_State}
				Switch_Value = {Switch_Value} 
			/>}
			< Menu 
				Set_Data = {Set_Data} 
				Set_Text = {Set_Text} 
				Set_Subject_Index = {Set_Subject_Index} 
				Set_Topic_Index = {Set_Topic_Index}
				Set_Description_State = {Set_Description_State}
				Set_Edit_Text_Mode = {Set_Edit_Text_Mode}
				Set_Edit_Label_Mode = {Set_Edit_Label_Mode}
				Set_Force_Render_State = {Set_Force_Render_State}
				Edit_Label_Mode = {Edit_Label_Mode}
				Choosen_Option = {Choosen_Option}
				Choosen_Description = {Choosen_Description}
				Information_Index = {Information_Index} 
				Switch_Value = {Switch_Value}
				Data = {Data}
				Text = {Text}
				Description_State = {Description_State} 
				Force_Render_State = {Force_Render_State}
				Subject_Index = {Subject_Index} 
				Topic_Index = {Topic_Index}
				Menu_Mode = {Menu_Mode}
				TextArea_Input = {TextArea_Input}
			/>
			<	Description
				Set_Menu_Mode = {Set_Menu_Mode} 
				Set_Force_Render_State = {Set_Force_Render_State}
				Set_Description_State = {Set_Description_State} 
				Set_Choosen_Description = {Set_Choosen_Description}
				Set_Text = {Set_Text}
				Set_Data = {Set_Data} 
				Set_Edit_Text_Mode = {Set_Edit_Text_Mode}
				Edit_Text_Mode = {Edit_Text_Mode}
				Switch_Value = {Switch_Value} 
				Information_Index = {Information_Index} 
				Description_State = {Description_State} 
				Data = {Data} 
				Text = {Text}
				Subject_Index = {Subject_Index} 
				Topic_Index = {Topic_Index} 
				TextArea_Input = {TextArea_Input}
			/>
			{/*eslint-disable-next-line */}
			<	Information_Choosing 
				Set_Information_Index = {Set_Information_Index}
				Set_Subject_Index = {Set_Subject_Index} 
				Set_Topic_Index = {Set_Topic_Index}
				Set_Menu_Mode = {Set_Menu_Mode}
				Set_Choosen_Option = {Set_Choosen_Option}
				Subject_Index = {Subject_Index}
				Topic_Index = {Topic_Index} 
				Data = {Data}
				Switch_Value = {Switch_Value}
			/>
		</div>
  )

	Data[Subject_Index].Subject_Info[Topic_Index].Topic_Info.push(
	{
		Title: "Sample",
		Descriptions: [],
		Branches: [],
		Position: {x: 0, y: 0}
	})
	Set_Data(Data);
	localStorage.setItem("Data", JSON.stringify(Data));
	return null;
}

export default Container;