import './style.css';
import { Questions } from './questions';
const TEMEOUT =4000;

const app = document.querySelector("#app")
const startButon = document.querySelector("#start");
function diplayNextQestionButton(Callback) 
      {
       let remainingTimout = TEMEOUT;

        app.querySelector("button").remove();
        const getButtonText = ()=> `Next (${remainingTimout / 1000}s)`;
        
        //permet de creer le buton next
        const nextButton = document.createElement("button");
        nextButton.innerText = getButtonText();
        app.appendChild(nextButton);

        const interval = setInterval(()=>
        {
          remainingTimout -= 1000
          nextButton.innerText = getButtonText();
        }, 1000);
        const timeout = setTimeout ( () => 
        {
         handleNextQuestion();
        }, TEMEOUT);
       
        const handleNextQuestion = () =>
        {
          clearInterval(interval);
          clearTimeout(timeout);
          Callback();
        }

        
        nextButton.addEventListener("click", ()=>{
          handleNextQuestion();
        });
      }
      //désactivé les autres questions
function DisableAllAnswer() 
{
  const radioInputs = document.querySelectorAll('input[type="radio"]');
  for( const radio of radioInputs)
  {
    radio.disabled = true;
  }
}

startButon.addEventListener("click", startQuiz)
function startQuiz(event) 
{
      event.stopPropagation();
      let currentQuestion = 0;
      let score = 0;
    clean();
      diplayQuestion(currentQuestion);

      function clean() 
      {
        while(app.firstElementChild)
        {
          app.firstElementChild.remove();
        }
        const progress = getProgressBar(Questions.length, currentQuestion);
        app.appendChild(progress);
      }


      function diplayQuestion(index) 
      {
        clean();
          const question = Questions[index];

          if (!question) 
          {
            //fin du quiz
            diplayFinishMessage();
            return;
          }
          
          const title = getTitletElement(question.question);
          app.appendChild(title);
          const answersDiv = createAnswers(question.answers);
          app.appendChild(answersDiv);
        
          //creer le bouton submit
          const submitButton = getSubmitButton();
          submitButton.addEventListener("click", submit);
          app.appendChild(submitButton);
      }

      function diplayFinishMessage() 
      {
        const h1 = document.createElement("h1");
        h1.innerText = "bravo tu as termine le quiez ."
        const p = document.createElement("p");
        p.innerText = `Tu as eu ${score} sur ${Questions.length} point !`;
        app.appendChild(h1);
        app.appendChild(p);
      }

      //gere l'envoie
      function submit() 
      {
        const selectedAnswer = app.querySelector('input[name="answer"]:checked');//checked permet de selection un element specifique du DOM
        DisableAllAnswer()
        const value = selectedAnswer.value;
        const question = Questions[currentQuestion];
        const isCorret = question.correct === value;
        //alert(`submit ${isCorret ? "Correct" : "Incorret"}`);

        if (isCorret) 
        {
          score++;
        }
        showFeedback(isCorret, question.correct, value);
        const feedback = showFeedbackMessage(isCorret, question.correct);
        app.appendChild(feedback);
        diplayNextQestionButton(()=>{
          currentQuestion++;
        diplayQuestion(currentQuestion);
        });
      }


      function createAnswers(answers) 
      {
          const answersDiv = document.createElement("div");
          //answersDiv.ClassList.add("answers");
          for (const answer of answers)
          {
            const label = getAnswerElement(answer)
            answersDiv.appendChild(label);
          }
          return answersDiv;
      } 
}
function getTitletElement(text) 
  {
    const title = document.createElement("h3");
    title.innerText = text;
    return title;
  }

  function formatId(text) 
  {
    return text.replaceAll(" ","_").replaceAll('"',"'").toLowerCase();
  }; 

function getAnswerElement(text) 
  {
    const label = document.createElement("label");
    label.innerText = text;
    const input = document.createElement("input"); 
    const id = formatId(text);
    input.id = id;
    label.htmlFor = id;
    input.setAttribute("type","radio");
    input.setAttribute("name","answer");
    input.setAttribute("value",text);
    label.appendChild(input);
    return label;
  }

  function getSubmitButton() 
  {
    const submitButton = document.createElement("button"); 
    submitButton.innerText = "submit";
    app.appendChild(submitButton);
    return submitButton;
  }

  //
  function showFeedback(isCorret, correct, answer) 
        {
          const correctAnswerId = formatId(answer );
          const correctElement = document.querySelector(`label[for="${correctAnswerId}"]`);

          const selectedAnswerId = formatId(correct);
          const selectedElement = document.querySelector(`label[for="${selectedAnswerId}"]`);

          if (isCorret) 
          {
            selectedElement.classList.add("incorrect");
             
          } else 
          {
            correctElement.classList.add("correct");
            selectedElement.classList.add("incorrect");
           
          }
        

        }

        function showFeedbackMessage(isCorret, correct) 
        {
          const paragraphe = document.createElement("p");
          paragraphe.innerText = isCorret ? "Bravo bonne reponse" : `Désole ..... mais tu peux faire mieux. ${correct}`;
          return paragraphe;
        }

        function getProgressBar(max, value) 
      {
        const progress = document.createElement("progress");
        progress.setAttribute("max", max)
        progress.setAttribute("value", value);
        return progress;
      }