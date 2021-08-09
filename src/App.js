import React from 'react';
import html2canvas from 'html2canvas';
import { Container, Row, Col } from 'react-bootstrap';
import './css/header.min.css';
import './css/buttons.min.css';
import './css/viewer.min.css';
import './css/footer.min.css';

var now = new Date();
var minutes = now.getMinutes();

// 起動時の時刻から対応する季節を文字列で返す
function getSeason(minutes){
    if(typeof(minutes) !== 'number') return;

    if(minutes >= 0 && minutes < 15){
        return "winter";
    }else if(minutes >= 15 && minutes < 30){
        return "spring";
    }else if(minutes >= 30 && minutes < 45){
        return "summer";
    }else if(minutes >= 45 && minutes < 60){
        return "autumn";
    }else{
        return;
    }
}

// 起動時の時刻から季節の初期・中期・後期を文字列で返す
function getTimePart(minutes){
    if(typeof(minutes) !== 'number') return;

    let timePart;

    if(minutes > 45){
        timePart = minutes - 45;
    }else if(minutes > 30){
        timePart = minutes - 30;
    }else if(minutes > 15){
        timePart = minutes - 15;
    }else{
        timePart = minutes;
    }

    if(timePart >= 0 && timePart < 5){
        return "time-first";
    }else if(timePart >= 5 && timePart < 10){
        return "time-second";
    }else if(timePart >= 10 && timePart <= 15){
        return "time-third";
    }else{
        return;
    }
}

const season   = getSeason(minutes);
// const season = "winter";
// const season = "spring";
// const season = "summer";
// const season = "autumn";

const timePart = getTimePart(minutes);
// const timePart = "time-first";

// 現在の季節と装飾場所に対応する色を文字列で返す
function defineDefaultColor(styleType){
    if(typeof(styleType) !== 'string') return;

    if(season === "winter" && styleType === "icon"){
        return "#536DFE";
    }else if(season === "winter" && styleType === "background"){
        return "#CFD8DC";
    }else if(season === "winter" && styleType === "border"){
        return "#BDBDBD";
    }else if(season === "spring" && styleType === "icon"){
        return "#FFEB3B";
    }else if(season === "spring" && styleType === "background"){
        return "#689F38";
    }else if(season === "spring" && styleType === "border"){
        return "#BDBDBD";
    }else if(season === "summer" && styleType === "icon"){
        return "#FFC107";
    }else if(season === "summer" && styleType === "background"){
        return "#0097A7";
    }else if(season === "summer" && styleType === "border"){
        return "#BDBDBD";
    }else if(season === "autumn" && styleType === "icon"){
        return "#FF5722";
    }else if(season === "autumn" && styleType === "background"){
        return "#D7CCC8";
    }else if(season === "autumn" && styleType === "border"){
        return "#BDBDBD";
    }else{
        return;
    }
}

// ランダム表示されるアイコンセット
const iconAnger     = ["fas fa-angry", "fas fa-fire", "fas fa-pepper-hot"];
const iconDisgust   = ["fas fa-frown", "fas fa-bug", "fas fa-viruses"];
const iconFear      = ["fas fa-dizzy", "fas fa-ghost", "fas fa-skull"];
const iconHappiness = ["fas fa-smile", "fas fa-gift", "fas fa-heart"];
const iconSorrow    = ["fas fa-sad-tear", "fas fa-cloud-rain", "fas fa-user-injured"];
const iconSurprise  = ["fas fa-surprise", "fas fa-magic", "fas fa-bomb"];

class App extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            iconName: "fas fa-question",
            iconColor: defineDefaultColor("icon"),
            backgroundColor: defineDefaultColor("background"),
            borderColor: defineDefaultColor("border"),
            iconSize: 145,
            isProcessing: false,
        }
    }

    // METHOD ==============================================================================================

    // 各カラーピッカーに対応したアイコンパーツの色を変える
    handleChangeColor = (e) => {
        const pickerType = e.target.id;
        const newColor = e.target.value;
        
        if(pickerType === 'color-icon'){
            this.setState({
                iconColor: newColor,
            });
        }else if(pickerType === 'color-background'){
            this.setState({
                backgroundColor: newColor,
            });
        }else if(pickerType === 'color-border'){
            this.setState({
                borderColor: newColor,
            });
        }else{
            return null;
        }
    }

    // アイコン固有のclassNameを受け取り対応するアイコンを変化させる
    handleChangeCurrentIcon = (e) => {
        const newIcon = e.target.value;
        this.updateCurrentIcon(newIcon);
    }

    // レンジバーの値を受け取りアイコンのサイズを変化させる
    handleChangeIconSize = (e) => {
        const newSize = e.target.value;

        this.setState({
            iconSize: newSize,
        });
    }

    // 表示中のアイコンに対応するファイル名を生成
    makeFileName(){
        const iconName = this.state.iconName;
        let fileName;
        if(iconName.match(/fas fa-/)){
            fileName = iconName.replace(/fas fa-/g, "");
        }else if(iconName.match(/fab fa-/)){
            fileName = iconName.replace(/fab fa-/g, "");
        }else{
            fileName = "your_icon";
        }
        return fileName;
    }

    // アイコンビュアーをcanvasとして画像に変換する
    onClickExport = () => {
        const isProcessing = this.state.isProcessing;
        if(isProcessing === true) return;

        this.setState({
            isProcessing: true,
        });

        const target = document.getElementById("target-component");
        html2canvas(target).then(canvas => {
            const targetImgUri = canvas.toDataURL("img/png");
            this.saveAsImage(targetImgUri);
        });

        setTimeout(() => {
            this.setState({
                isProcessing: false,
            });
        }, 2000);
    }

    // 画像をブラウザ上でダウンロードする
    saveAsImage = (uri) => {
        const downloadLink = document.createElement("a");

        const fileName = this.makeFileName();
        
        if(typeof(downloadLink.download) === "string"){
            downloadLink.href = uri;
            downloadLink.download = "icon_" + fileName + ".png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        }else{
            window.open(uri);
        }
    }

    // クリックされたボタンのIDに応じてランダムなアイコンを表示させる
    selectRandomIcon = (e) => {
        const currentIcon = this.state.iconName;
        const typeOfEmotion = e.target.id;
        let iconEmotion;
        let newIcon = null;
        
        if(typeOfEmotion === "ANGER"){
            iconEmotion = iconAnger;
        }else if(typeOfEmotion === "DISGUST"){
            iconEmotion = iconDisgust;
        }else if(typeOfEmotion === "FEAR"){
            iconEmotion = iconFear;
        }else if(typeOfEmotion === "HAPPINESS"){
            iconEmotion = iconHappiness;
        }else if(typeOfEmotion === "SORROW"){
            iconEmotion = iconSorrow;
        }else if(typeOfEmotion === "SURPRISE"){
            iconEmotion = iconSurprise;
        }else{
            return null;
        }

        while(currentIcon === newIcon || newIcon === null){
            newIcon = iconEmotion[Math.floor(Math.random() * iconEmotion.length)];
        }

        this.updateCurrentIcon(newIcon);
    }

    // 新しいアイコン固有のclassNameを文字列で受け取りアイコンのstateを更新する
    updateCurrentIcon(newIcon){
        if(typeof(newIcon) !== "string") return;
        
        this.setState({
            iconName: newIcon,
        });
    }

    // RENDER ==============================================================================================

    // ランダムボタンの描画
    renderButtons(emotion){
        if(typeof(emotion) !== 'string'){
            return null;
        }

        return(
            <button 
                id={emotion}
                className={
                    emotion + " " +
                    season + " " +
                    timePart + " " +
                    "button"
                }
                onClick={this.selectRandomIcon}
                data-testid="emotion-button"
            >{emotion}</button>
        );
    }

    // ダウンロードボタンの描画
    renderDownloadButton(){
        return(
            <button 
                id="download_button"
                onClick={this.onClickExport}
                className={
                    season + " " +
                    timePart + " " +
                    "button download"
                }
                data-testid="download"
                // disabled
            >DOWNLOAD</button>
        );
    }

    // エディターの描画
    renderEditor(){
        const iconName = this.state.iconName;
        const iconColor = this.state.iconColor;
        const backgroundColor = this.state.backgroundColor;
        const borderColor = this.state.borderColor;
        const iconSize = this.state.iconSize;

        return(
            <div>
                <div className="icon-name">
                    <input 
                        className={season} 
                        type="text" 
                        placeholder="Enter any class name of fa-icon."
                        value={iconName} 
                        onChange={this.handleChangeCurrentIcon} 
                        maxLength="30"
                        data-testid="icon-name"
                    />
                </div>
                <div className="color-picker">
                    <div>
                        <input 
                            id="color-icon" 
                            type="color" 
                            value={iconColor} 
                            onChange={this.handleChangeColor} 
                            data-testid="color-icon"
                        />
                    </div>
                    <div>
                        <input 
                            id="color-background" 
                            type="color" 
                            value={backgroundColor} 
                            onChange={this.handleChangeColor} 
                            data-testid="color-background"
                        />
                    </div>
                    <div>
                        <input 
                            id="color-border" 
                            type="color" 
                            value={borderColor} 
                            onChange={this.handleChangeColor} 
                            data-testid="color-border"
                        />
                    </div>
                </div>
                <div className="range-wrap">
                    <input 
                        type="range" 
                        value={iconSize} 
                        min="40" 
                        max="250" 
                        onChange={this.handleChangeIconSize} 
                        data-testid="icon-size"
                    />
                </div>
            </div>
        );
    }

    // アイコンビュアーの描画
    renderIconViewer(){
        const currentIcon = this.state.iconName;
        const fontSize = this.state.iconSize + "%";

        const viewerStyle = {
            borderColor: this.state.borderColor,
            backgroundColor: this.state.backgroundColor,
        }

        const circleStyle = {
            backgroundColor: this.state.backgroundColor,
        }

        const iconStyle = {
            color: this.state.iconColor,
            fontSize: fontSize,
        }
    
        return(
            <div 
                id="target-component"
                className={
                    season + " " +
                    timePart + " " +
                    "icon-viewer" 
                }
                style={viewerStyle}
                data-testid="icon-viewer"
            >
                <div className="black-wrapper">
                    <div className="circle-wrapper" style={circleStyle}>
                        <i 
                            className={currentIcon} 
                            style={iconStyle} 
                            data-testid="icon-element"
                            name={currentIcon}
                        ></i>
                    </div>
                </div>
            </div>
        );
    }

    // 全体の描画
    render(){ 
        return(
            <div className={
                season + " " +
                "whole-wrap"
            }>
                <Container>
                    <Row>
                        <header className={season + " " + timePart}>
                            <div>
                                <h1 className={season + " " + timePart}>Awesome Icon Maker by Font Awesome</h1>
                            </div>
                            <div>
                                <small className={season + " " + timePart} data-testid="copyright">created by Shogo Wada</small>
                            </div>
                        </header>
                    </Row>
                    <Row className={
                        season + " " +
                        timePart + " " +
                        "main-part"
                    }>
                        <Col 
                            xs={{span: 6, order: 1}}
                            md={{span: 3, order: 1}}
                        >
                            <div className="button-box box-left">
                                {this.renderButtons("ANGER")}
                                {this.renderButtons("DISGUST")}
                                {this.renderButtons("FEAR")}
                            </div>
                        </Col>
                        <Col
                            xs={{span: 12, order: 3}}
                            md={{span: 6, order: 2}}
                        >
                            <div className="viewer">
                                {this.renderIconViewer()}
                                {this.renderEditor()}
                                {this.renderDownloadButton()}
                            </div>
                        </Col>
                        <Col
                            xs={{span: 6, order: 2}}
                            md={{span: 3, order: 3}}
                        >
                            <div className="button-box box-right">
                                {this.renderButtons("HAPPINESS")}
                                {this.renderButtons("SORROW")}
                                {this.renderButtons("SURPRISE")}
                            </div>
                        </Col>
                    </Row>
                    <Row>
                       <footer className={season + " " + timePart} data-testid="footer">
                           <small>
                               Attribution notation : <a href="https://fontawesome.com/license/free" className={season}>Font Awesome Free License</a> , <a href="https://creativecommons.org/licenses/by/4.0/" className={season}>CC BY 4.0 License</a>
                           </small>
                       </footer>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default App;
