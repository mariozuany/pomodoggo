function loui(data){

  // const renderTemplate = () => {
  //   y = document.body.textContent.match(/{{(.*)}}/);
  //
  //   if (!y) {
  //     return;
  //   }
  //
  //   if (y[1].match(/\./)) {
  //
  //     let n = [];
  //     v = y[1].split('.').map((item, index) => {
  //       n = index === 0 ? data[item] : n[item];
  //       return n;
  //     }).pop();
  //
  //     document.body.innerHTML = document.body.innerHTML.replace(y[0], v)
  //   } else {
  //     document.body.innerHTML = document.body.innerHTML.replace(y[0], data[y[1]])
  //   }
  // };
  //
  // renderTemplate();

  const mapElements = (callback) => {
    Array.from(document.querySelectorAll('[model]')).map( item => {
      const modelAttribute = item.attributes['model'].value;
      callback(item, modelAttribute);
    });

    // renderTemplate();
  };

  const bindDataToElements = () => {
    console.log('bindDataToElements');
    mapElements((item, modelAttribute) => {
      if (typeof(item.value) !== 'undefined') {
        item.value = data[modelAttribute];
      } else if (typeof(item.innerText) !== 'undefined') {
        item.innerText = data[modelAttribute];
      }
    })
  };

  window.targetProxy = new Proxy(data, {
    set: function (target, key, value) {
      target[key] = value;
      bindDataToElements();
      return true;
    }
  });

  const addEventsListeners = () => {
    mapElements((item, modelAttribute) => {

      if (item.tagName === 'INPUT') {
        item.addEventListener('change', (e) => {
          window.targetProxy[modelAttribute] = e.target.value;
        });
        item.addEventListener('keydown', (e) => {
          window.targetProxy[modelAttribute] = e.target.value;
        });
      }
    });
  };

  addEventsListeners();
}

document.querySelector('#todo_input').addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    window.targetProxy.todo.data.push({
      task: someData.temptask,
      status: true,
    });
    window.targetProxy.temptask = '';
    renderTodoList();
  }
});

const parser = () => {
  const item = '<li @loop="todo.data" @status="status">{{task}}@loop="todo"</li>';
  const element = 'li';
  console.log( /<(.+?)>/gm.exec(item));
  const attributes = item.match(/<(.+?)>/gm)[0];
  const keywords = attributes.match(/@\w*="(.*?)"/gm);
  const params = keywords.map(item => item.split('='));
  const pValues = {};
  params.map(item => {
    pValues[item[0]] = item[1].replace('"','');
  });
  console.log(keywords, params, pValues);



};

parser();


var stack = [], node, ii;
stack.push(document.body);

while (stack.length > 0) {
  node = stack.pop();
  if (node.attributes['@loop']) {
    console.log(node.attributes);
    // Found it!
    return node;
  } else if (node.children && node.children.length) {
    for (ii = 0; ii < node.children.length; ii += 1) {
      stack.push(node.children[ii]);
    }
  }
}

// Didn't find it. Return null.
return null;

const renderTodoList = () => {
  const elmUl = document.querySelector('#todo_list');
  const listHTML = someData.todo.data.map( item => {
   return `<li status="${item.status}">${item.task}</li>`;
  }).join('');

  elmUl.innerHTML = listHTML;
};

window.someData = {
  foo: 'abc',
  joo: {
    bla: {
      bli: 'yey'
    }
  },
  moo: {
    text: 'Some text'
  },
  temptask: '',
  todo: {
    title: 'Just another To Do example.',
    data: [
      {
        task: 'Buy some milk.',
        status: false,
      }],
  },
};

loui(someData);