async function handleSubmit() {
    const formData = new FormData();
    let pdfFile=document.querySelector('#pdfFile').files[0];
    formData.append("pdf", pdfFile);
    console.log(formData)

    try {
      let responseMessage = false;
      let response;
      
      response = await fetch("http://127.0.0.1:8000/upload", {
        method: "POST",
        mode: "no-cors",
        body: formData,
      });
      responseMessage = response.ok;
      console.log(response)
      
      if (response.type === 'opaque' || response.ok) {
          console.log("Submitted successfully")
      } else {
        alert("Failed to submit form.");
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred while submitting the form.");
    }
  };


  async function downloadpdf(){
    try {
        let responseMessage = false;
        let response;
        
        response = await fetch("http://127.0.0.1:8000/download", {
          method: "GET",
          mode: "no-cors",
        });
  
      } catch (error) {
        console.error("Error submitting form:", error);
        alert("An error occurred while submitting the form.");
      }
  }



async function viewpdf(filename) {
    try {
        // Fetch the PDF from the Flask server
        const response = await fetch(`http://127.0.0.1:8000/download?filename=${encodeURIComponent(filename)}`,{
          method: "GET",
          mode: "cors",
        });
        
        // Check if the response is OK
        if (!response.ok) {
            throw new Error('Failed to fetch PDF');
        }

        // Convert the response to a Blob object
        const blob = await response.blob();

        // Create a URL for the Blob object
        const pdfUrl = window.URL.createObjectURL(blob);

        // Set the URL as the source of the iframe
        let ifr=document.createElement('iframe')
        ifr.style.width='600px';
        ifr.style.height='700px';
        const pdfViewer = document.getElementById('pdf-container');
        ifr.src = pdfUrl;
        pdfViewer.appendChild(ifr)
        return false;

    } catch (error) {
        console.error('Error:', error);  // Log any errors
    }
}


async function getFileList() {
  try {
    const response =  await fetch('http://127.0.0.1:8000/filelist');
    body = await response.json()
    if(response.ok){
      console.log(response)
      console.log(body)
      let container = document.querySelector('#file-list-container')
      container.innerHTML=''
      body.forEach(i => {
        let p = document.createElement('p')
        p.textContent=i
        p.addEventListener('click',()=>{
          viewpdf(i)
        })
        container.appendChild(p)
      });
    }
    else
      console.log(response)
  }
  catch(error){
    console.error(error);
  }
}





public static void Max_number(String str)
    {
      ArrayList<ArrayList<Integer>> lis= new ArrayList<>();
      int n = str.length();
      int digs[] = new int[N];

        for (int i = 0; i < n; i++)
          digs[i] = (Integer.parseInt("" + str.charAt(i)));

        int lft = 0;

        while (left < n) {
            ArrayList<Integer> temp = new ArrayList<>();
            int rht = lft;
            while (rht < (n - 1) && (digs[rht]) % 2 == (digs[rht + 1]) % 2) {
                temp.add(digs[rht]);
                rht++;
            }
            temp.add(digs[rht]);
            Collections.sort(temp, Collections.reverseOrder());
           .add(temp);
            lft = rht + 1;
        }

        for (ArrayList<Integer> l : lis) {
            for (Integer x : l) {
                System.out.print(x);
            }
        }
    }
