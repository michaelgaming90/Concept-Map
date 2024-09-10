import React, { useState, useEffect } from "react";
import "./../css/Information_Choosing.css"

function Information_Choosing(Props)
{
  const [Button_Topic_State, Set_Button_Topic_State] = useState(() => false);
	const [Button_Subject_State, Set_Button_Subject_State] = useState(() => false);
	const [Add_Topic_State, Set_Add_Topic_State] = useState(() => false);
	const [Topic, Set_Topic] = useState(() => "");
	const [Subject, Set_Subject] = useState(() => "");
	const [Add_Subject_State, Set_Add_Subject_State] = useState(() => false);
	
	useEffect(() =>
	{
		Props.Set_Menu_Mode(() => `Option_Menu ${Add_Topic_State? "Add": ""} Topic`)
		// eslint-disable-next-line
	}, [Add_Topic_State, Topic]);

	useEffect(() =>
	{
		Props.Set_Menu_Mode(() => `Option_Menu ${Add_Subject_State? "Add": ""} Subject`)
		// eslint-disable-next-line
	}, [Add_Subject_State, Subject]);

	function Topic_Click_Event(Index)
	{
		Set_Topic(() => Props.Data[Props.Subject_Index].Subject_Info[Index].Topic);
		Props.Set_Topic_Index(() => Index);
		Set_Button_Subject_State(() => false);
		Set_Button_Topic_State(() => false);
	}

	function Subject_Click_Event(Index)
	{
		Set_Subject(() => Props.Data[Index].Subject);
		Props.Set_Topic_Index(() => 0);
		Props.Set_Subject_Index(() => Index);
		Set_Button_Topic_State(() => false);
		Set_Button_Subject_State(() => false);
	}

	function Display_Topic_Options()
	{
		return Props.Data[Props.Subject_Index].Subject_Info.map((Subject, Index) =>
		(	
			<label 
				key = {Index}
				onClick = {() => 
					{
						Topic_Click_Event(Index); 
						Set_Add_Topic_State(() => false);
						Props.Set_Choosen_Option({Mode: "Topic", Name: Subject.Topic})
					}
				}
			>{Subject.Topic}
			</label>
		))
	}

	function Display_Subject_Options()
	{
		return Props.Data.map((Data, Index) =>
		(
			<label
			key = {Index}
			onClick = {() => 
				{
					Subject_Click_Event(Index); 
					Set_Add_Subject_State(() => false);
					Props.Set_Choosen_Option({Mode: "Subject", Name: Data.Subject})
				}}>
			{Data.Subject}
			</label>
		));
	}

  return (
    <div className = {`Option_Div ${Props.Switch_Value? "Edit": "Unedit"}`}>
			<div>
				<div className = "Header" onClick={() => {Set_Button_Topic_State((Prev) => !Prev); Set_Topic(() => "")}}>
					<label>Topic: </label>
					{Topic}
					<span className = "arrow">{Button_Topic_State? '^' : 'v'}</span>
				</div>
				<div className = {`Options ${Button_Topic_State? 'show' : ''}`}>
					{Display_Topic_Options()}
					{Props.Switch_Value && <label onClick = {() => Set_Add_Topic_State(() => true)}>+</label>}
				</div>
			</div>
			<div>
				<div className = "Header" onClick={() => {Set_Button_Subject_State((Prev) => !Prev); Set_Subject(() => "")}}>
					<label>Subject: </label>
					{Subject}
					<span className = "arrow">{Button_Subject_State? '^' : 'v'}</span>
				</div>
				<div className = {`Options ${Button_Subject_State? 'show' : ''}`}>
					{Display_Subject_Options()}
					{Props.Switch_Value && <label onClick = {() => Set_Add_Subject_State(() => true)}>+</label>}
				</div>
			</div>
    </div>
  );
}

export default Information_Choosing;