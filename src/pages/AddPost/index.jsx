import React from "react";
import TextField from "@mui/material/TextField";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import SimpleMDE from "react-simplemde-editor";

import "easymde/dist/easymde.min.css";
import styles from "./AddPost.module.scss";
import { useSelector } from "react-redux";
import { selectIsAuth } from "../../redux/slices/auth";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import axios from "../../axios";

export const AddPost = () => {
  const navigate = useNavigate();
  const inputFileRef = React.useRef(null);
  const [isLoading, setLoading] = React.useState(false);
  //авторизованы или нет
  const isAuth = useSelector(selectIsAuth);
  // сохраняет данные, которые мы ввели в поле
  const [text, setText] = React.useState("");
  const [tags, setTags] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [imageUrl, setImageUrl] = React.useState("");
  // Для редактировании статьи, в app.js сделали такой же роут
  // как и на добавлении статьи, но теперь получаем id и вшиваем
  // полученни данные в поля формы
  const { id } = useParams();
  //если есть id - значит редактировании(нет - добавление)
  const isEdit = Boolean(id);

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const handleChangeFile = async (event) => {
    try {
      const formData = new FormData();
      const file = event.target.files[0];
      formData.append("image", file);
      const { data } = await axios.post("/upload", formData);

      setImageUrl(data.url);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при загрузке");
    }
  };

  const onClickRemoveImage = () => {
    setImageUrl("");
  };
  // ОТПРАВЛЯЕМ ДАННЫЕ НА БЭК о создании новой записи(ее поля) ,
  //(в редаксе нету смысла добавлять это (незначительно))
  const onSubmit = async () => {
    try {
      setLoading(true);
      // Поля, которые отправляем на бэк
      const fields = {
        title,
        text,
        tags,
        imageUrl,
      };
      // Если это редактирование, то отправляем данные полей на изменения
      // Если это создание - создаем пост на бэке
      const { data } = isEdit
        ? await axios.patch(`/posts/${id}`, fields)
        : await axios.post("/posts", fields);
      // при axios.patch данные не вернутся, соответствено для направления
      // куда нас направлять при превью делаем такую проверку
      const _id = isEdit ? id : data._id;
      // и отправляем на превью (FullPost)
      navigate(`/posts/${_id}`);
    } catch (error) {
      console.warn(error);
      alert("Ошибка при создании статьи!");
    }
  };

  // Получаем данные с бэка о записи, чтобы их вшить в поля формы
  React.useEffect(() => {
    // Если id в адресной строчке есть - значит редактирование
    if (id) {
      // Отправляем данные о полях и вносим изменения для актуального отображения
      axios
        .get(`/posts/${id}`)
        .then(({ data }) => {
          setTags(data.tags.join(','));
          setText(data.text);
          setImageUrl(data.imageUrl);
          setTitle(data.title);
        })
        .catch((err) => {
          console.log(err);
          alert("Ошибка получение статей");
        });
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: "400px",
      autofocus: true,
      placeholder: "Введите текст...",
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    []
  );
  // Если мы не авторизованы, то переходим на главную
  // Токен нужен потому что в процессе запроса авторизованы мы или нет
  // он заранее выкидывает на Home так как в этот момент рендерится приложение
  if (!window.localStorage.getItem("token") && !isAuth) {
    return <Navigate to="/" />;
  }

  return (
    <Paper style={{ padding: 30 }}>
      <Button
        onClick={() => inputFileRef.current.click()}
        variant="outlined"
        size="large"
      >
        Загрузить превью
      </Button>
      <input
        ref={inputFileRef}
        type="file"
        onChange={handleChangeFile}
        hidden
      />
      {imageUrl && (
        <>
          <Button
            variant="contained"
            color="error"
            onClick={onClickRemoveImage}
          >
            Удалить
          </Button>
          <img
            className={styles.image}
            src={`http://localhost:4444${imageUrl}`}
            alt="Uploaded"
          />
        </>
      )}

      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        variant="standard"
        placeholder="Заголовок статьи..."
        fullWidth
      />
      <TextField
        classes={{ root: styles.tags }}
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        variant="standard"
        placeholder="Тэги"
        fullWidth
      />
      <SimpleMDE
        className={styles.editor}
        value={text}
        onChange={onChange}
        options={options}
      />
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEdit ? "Изменить" : "Опубликовать"}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
