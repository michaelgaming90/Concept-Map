import "./../css/Settings.css";

function Settings(Props)
{
  function Toggle_Switch()
  {
    Props.Set_Switch_Value((value) => !value);
  }

  return(
    <div className = "Settings">
			<label>Edit Mode:</label>
			<div className = {`Switch ${Props.Switch_Value? "on": "off"}` } onClick={Toggle_Switch}>
        <div className = "Switch_Knob"></div>
      </div>
    </div>
  );
}

export default Settings;