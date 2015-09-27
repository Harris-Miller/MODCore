
export default class DataHandler {

  bind(current, morphs, token) {
    let propName = token.expName;

    let node = document.createTextNode('');
    current.appendChild(node);

    if (!(propName in morphs)) {
      morphs[propName] = [];
    }

    morphs[propName].push([node, 'text']);
  }
}
