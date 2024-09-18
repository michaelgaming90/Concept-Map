import "./../css/Authentication.css";
import React, { useState, useRef } from "react";
const Server = "http://localhost:3000" //"https://concept-map.onrender.com";

function Authentication(Props)
{
	const [Authenticated, Set_Authenticated] = useState(() => false);
	const Name_Ref = useRef(null);
	const Password_Ref = useRef(null);

	function Authenticating()
	{
		if(Name_Ref.current.value === "Michael" && 
			Password_Ref.current.value === "L0lipop")
			Props.Set_Admin_State(() => true);
		Set_Authenticated(() => true);
	}

	function Keep_Data()
	{
		Props.Set_Authentication_State(() => false);
		if(JSON.parse(localStorage.getItem("Data"))) Saved_Data();
		if(JSON.parse(localStorage.getItem("Data"))) return;
		Local_Storage_Set_Up();
		Saved_Data();
		Props.Set_Data(() => JSON.parse(localStorage.getItem("Data")));
	}

	function Get_Data()
	{
		fetch(`${Server}/data`)
			.then(response => response.json())
			.then(data =>
			{
				Props.Set_Data(() => data);
				localStorage.setItem("Data", JSON.stringify(data));
				Props.Set_Authentication_State(() => false);
			})
			.catch(err => 
			{
				console.log(err);
				Props.Set_Authentication_State(() => false);
				if(JSON.parse(localStorage.getItem("Data"))) return;
				Local_Storage_Set_Up();
				Props.Set_Data(() => JSON.parse(localStorage.getItem("Data")));
			});
	}
	
	if(!Authenticated)
  return(
		<div className = "Authentication_Div">
			<label className = "Title">Authentication</label>
			<label>Name: </label>
			<input ref = {Name_Ref} type = "text"/>
			<label>Password: </label>
			<input ref = {Password_Ref} type="password"/>
			<button onClick = {Authenticating}>Submit</button>
		</div>
	)

	return(
		<div className = "Authentication_Div">
			<label className = "Title">Authentication</label>
			<button onClick = {Get_Data}>Update</button>
			{Props.Admin_State && <button onClick = {Keep_Data}>Keep</button>}
		</div>);
}

function Local_Storage_Set_Up()
{
  let data = 
	[
		{
			Subject: "Sample_Subject",
			Subject_Info:
			[
				{
					Topic: "Sample",
					Topic_Info: 
					[
						{
							Title: "Sample",
							Descriptions: [],
							Branches: ["Sample 2", "Sample 3"],
							Position: {x: 0, y: 0}
						},
						{
							Title: "Sample 2",
							Descriptions: [],
							Branches: ["Sample 3"],
							Position: {x: 0, y: 0}
						},
						{
							Title: "Sample 3",
							Descriptions: [],
							Branches: [],
							Position: {x: 0, y: 0}
						}
					]
				}
			]
		}
	]

  localStorage.setItem("Data", JSON.stringify(data));
}

async function Saved_Data()
{
	const Data = JSON.parse(localStorage.getItem("Data"));
	try
	{
		 // eslint-disable-next-line
		const response = await fetch(`${Server}/save`,
			{
				method: "PUT",
				headers: {"Content-Type": "application/json"},
				body: JSON.stringify(Data)
			}
		)
		console.log(await response.text());
	}
	catch(error)
	{
		console.log(error);
	}
}

export default Authentication;