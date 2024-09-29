import Description from "./Description";
import Settings from "./Settings";
import Overview from "./Overview";
import Menu from "./Menu";
import Information_Choosing from "./Information_Choosing";
import Authentication from "./Authentication";

import React, { useState, useRef, ReactElement } from "react";
import "./../css/Container.css";

type Data = {
	Subject: string;
	Subject_Info: {
		Topic: string;
		Topic_Info: {
			Title: string;
			Descriptions: string[];
			Position: {
        x: number;
        y: number;
      };
			Branches: string[];
			}[];
	}[];
}

const Container: React.FC = (): ReactElement| null =>
{
	const [Information_Index, Set_Information_Index] = useState<number>(() => 0);
	const [Subject_Index, Set_Subject_Index] = useState<number>(() => 0);
	const [Topic_Index, Set_Topic_Index] = useState<number>(() => 0);
	const [Authentication_State, Set_Authentication_State] = useState<boolean>(() => true);
	const [Description_State, Set_Description_State] = useState<boolean>(() => false);
	const [Edit_Label_Mode, Set_Edit_Label_Mode] = useState<boolean>(() => false);
	const [Edit_Text_Mode, Set_Edit_Text_Mode] = useState<boolean>(() => false);
  const [Switch_Value, Set_Switch_Value] = useState<boolean>(() => false);
	const [Admin_State, Set_Admin_State] = useState<boolean>(() => false);
  const [ , Set_Force_Render_State] = useState<boolean>(() => false);
	const [Menu_Mode, Set_Menu_Mode] = useState<string>(() => "Description_Menu");
	const [Text, Set_Text] = useState<string>(() => "");
	const [Data, Set_Data] = useState<Data[]>(() => {	const Information =  localStorage.getItem("Data"); if(Information)return JSON.parse(Information)});
	const [Choosen_Option, Set_Choosen_Option] = useState<{Mode: string, Name: string}>(() => ({Mode: "", Name: ""}));
	
	const TextArea_Input = useRef<HTMLTextAreaElement>(null);

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
				Information_Index = {Information_Index}
			/>
      {Admin_State &&
			<	Settings 
				Set_Switch_Value = {Set_Switch_Value} 
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
				Information_Index = {Information_Index} 
				Switch_Value = {Switch_Value}
				Data = {Data}
				Text = {Text} 
				Subject_Index = {Subject_Index} 
				Topic_Index = {Topic_Index}
				Menu_Mode = {Menu_Mode}
				TextArea_Input = {TextArea_Input}
			/>
			<	Description
				Set_Menu_Mode = {Set_Menu_Mode} 
				Set_Force_Render_State = {Set_Force_Render_State}
				Set_Description_State = {Set_Description_State} 
				Set_Information_Index = {Set_Information_Index}
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