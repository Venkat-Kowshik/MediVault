export default function Sidebtn(props){
    return (
        <div onClick={props.onClick} className="side-btn" >{props.name}</div>

    );
}