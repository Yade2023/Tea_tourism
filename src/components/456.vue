 const [text, setText] = useState('Hello');
            const getData = (e) => {
              setText(e.target.value);
            }

            return <>
            {Text}
            <input type="text" value={text} onChange={getData}></input>
            </>