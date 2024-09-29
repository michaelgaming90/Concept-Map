import "./../css/Authentication.css";
import React, { useState, useRef } from "react";
const Server = "https://concept-map.onrender.com";

type Authentication_Props =
{
	Admin_State: boolean;

	Set_Authentication_State: React.Dispatch<React.SetStateAction<boolean>>
	Set_Admin_State: React.Dispatch<React.SetStateAction<boolean>>
	Set_Data: React.Dispatch<React.SetStateAction<Data[]>>
}

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

const Authentication: React.FC<Authentication_Props> = (Props) =>
{
	const [Authenticated, Set_Authenticated] = useState<boolean>(() => false);
	const Name_Ref = useRef<HTMLInputElement>(null);
	const Password_Ref = useRef<HTMLInputElement>(null);

	function Authenticating(): void
	{
		if(!Name_Ref.current || !Password_Ref.current) return;
		if(Name_Ref.current.value === "Michael" && 
			Password_Ref.current.value === "L0lipop")
			Props.Set_Admin_State(() => true);
		Set_Authenticated(() => true);
	}

	function Keep_Data(): void
	{
		Props.Set_Authentication_State(() => false);
		let Information = localStorage.getItem("Data");
		if(!Information) 
		{
			Saved_Data();
		 	return;
		}
		Local_Storage_Set_Up();
		Saved_Data();
		Information = localStorage.getItem("Data");
		if(!Information) return;
		Props.Set_Data(() => JSON.parse(Information));
	}

	function Get_Data(): void
	{
		fetch(`${Server}/data`)
			.then(response => response.json())
			.then(data =>
			{
				Props.Set_Data(() => data);
				localStorage.setItem("Data", JSON.stringify(data));
				Props.Set_Authentication_State(() => false);
			})
			.catch(() => 
			{
				Props.Set_Authentication_State(() => false);
				let Information = localStorage.getItem("Data");
				if(!Information) return;
				if(JSON.parse(Information)) return;

				Local_Storage_Set_Up();
				Information = localStorage.getItem("Data");
				if(!Information) return;
				Props.Set_Data(() => JSON.parse(Information));
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
	const Information = localStorage.getItem("Data");
	if(!Information) return;

	const Data = JSON.parse(Information);
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