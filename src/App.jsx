import React, { useRef, useEffect, useState } from 'react';

const worker = new Worker('./src/jsonWorker.js');

function Renderer({ value }) {
  const valueType = typeof value;
  if (value === undefined) {
    return <span className='valueField'>undefined</span>
  }
  if (value === null) {
    return <span className='valueField'>null</span>
  }
  if (valueType === 'object') {
    if (Array.isArray(value)) {
      return (
        <React.Fragment>
          <span className='arrayBracket'>&#91;</span>
          {value.map((arrayValue, index) => (
            <section className='spacedContent' key={index}>
              <span className='arrayIndex'>{index}: </span>
              <Renderer value={arrayValue} />
            </section>
          ))}

          <div className='arrayBracket'>&#93;</div>
        </React.Fragment>
      );
    }
    return (
      <section>
        {
          Object.entries(value).map(([key, value]) => {
            return (
              <section className='spacedContent' key={key}>
                <span className='nameField'>{key}: </span>
                <Renderer value={value} />
              </section>
            );
          })
        }
      </section>
    )
  } else if (valueType === 'string') {
    return <span className='valueField'>"{value}"</span>
  } else if (valueType === 'boolean') {
    return <span className='valueField'>{String(value)}</span>
  }
  return <span className='valueField'>{value}</span>
}



export default function App() {
  const fileInputRef = useRef();
  const [state, setState] = useState()

  console.log(state);
  useEffect(() => {
    fileInputRef.current.addEventListener('change', (event) => {
      const file = event.target.files[0];
      if (file) {
        // Send the file to the web worker for parsing
        worker.postMessage(file);
      }
    });

    worker.onmessage = (event) => {
      const jsonData = event.data;
      console.log(jsonData);
      setState(jsonData);
    };
  }, []);

  return (
    <section>
      <input ref={fileInputRef} type="file" id="fileInput" accept=".json" />
      <section>
        <Renderer value={state} />
      </section>
    </section>
  )
}
