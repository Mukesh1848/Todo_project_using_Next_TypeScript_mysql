import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import Header from "../Header";
import Link from "next/link";
import {
  fetchTodosApi,
  deleteTodoApi,
  shareTodoApi,
  showUserNameApi,
  removePermissionsApi,
} from "../../helperFunctions/apiHelper";
import { RingSpinner } from "react-spinners-kit";
import withAuth from "../../utils/withAuth";
import { FaShareAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";
// import { useTodos } from "../../helperFunctions/apiHelper";
import { useQuery } from "@tanstack/react-query";
import {viewTodo, User} from '../../helperFunctions/interfaceHelper'
import {handleChangeSelectedUserIds, handleChangePermissions} from "../../helperFunctions/inputChangeHelper";
import ToastConfig from "../../helperFunctions/toastConfig";
import DeleteSvg from '../../assets/deleteSvg'
import EditSvg from '../../assets/editSvg'

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const ViewTodos: React.FC = () => {
  const {
    data: todos,
    isLoading,
    refetch,
    error
  } = useQuery<viewTodo[]>({ queryKey: ["data"], queryFn: fetchTodosApi });

  const [open, setOpen] = useState(false);
  const [selectedTodo, setSelectedTodo] = useState<viewTodo | null>(null);
  const theme = useTheme();
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [names, setNames] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  
  const permissionOptions = ["Read", "Update", "Delete"];

  const getStyles = (name: number, selectedUserIds: number[], theme: any) => {
    return {
      fontWeight:
        selectedUserIds.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  };

  const handleOpen = async (todo: viewTodo) => {
    setSelectedTodo(todo);
    setOpen(true);
    await allUser();
  };
  

  const handleClose = () => {
    setOpen(false);
  };

  const handleShareAndClose = async () => {
    await handleShare();
    handleClose();
  };

  const handleShare = async () => {
    if (!selectedTodo) return;

    try {
      await shareTodoApi(selectedTodo.id, selectedUserIds, permissions);
      toast.success("Todo shared successfully!");
      handleClose();
    } catch (error) {
      toast("Oops, Something Went Wrong!");
    }
  };

  const handleRemovePermissionsAndClose = async () => {
    handleRemovePermissions();
    handleClose();
  };

  const handleRemovePermissions = async () => {
    if (!selectedTodo) return;

    try {
      await removePermissionsApi(selectedTodo.id, selectedUserIds, permissions);
      toast.success("Permissions removed successfully!");
      handleClose();
    } catch (error) {
      toast("Oops, Something Went Wrong!");
    }
  };

  const deleteTodo = async (id: number) => {
    if (window.confirm("Are you sure you want to delete?")) {
      try {
        await deleteTodoApi(id);
        refetch();
        toast.success("Todo Deleted Successfully!");
      } catch (error: any) {
        if (error.response && error.response.status === 403) {
          toast(error.response.data.message);
        } else {
          toast.warning("Oops, Something Went Wrong!");
        }
      }
    }
  };

  const allUser = async () => {
    try {
      const response = await showUserNameApi();
      setNames(response);
    } catch (error) {
      toast("No Others User Found...!");
    }
  };

  useEffect(() => {
    if (error) {
      toast("Oops Something Went Wrong...!");
    }
  }, [error]);

  

  return (
    <>
      <Header />
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-col text-center w-full mb-20">
            <h1 className="text-4xl font-medium title-font mb-4 text-gray-900">
              Your Todos
            </h1>
          </div>
          {isLoading ? (
            <div className="flex justify-center">
              <RingSpinner size={50} color="#00bfff" />
            </div>
          ) : (
            <div className="w-full">
              <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Description
                      </th>
                      <th scope="col" className="px-6 py-3">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {todos?.map((item, index) => (
                      <tr
                        className="odd:bg-white even:bg-gray-50 border-b"
                        key={index}
                      >
                        <th
                          scope="row"
                          className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                        >
                          {item.title}
                        </th>
                        <td className="px-6 py-4">{item.description}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex">
                            <a
                              className="cursor-pointer font-medium border-2 border-red-500 rounded-md p-1 hover:bg-red-500 hover:text-white"
                              onClick={() => deleteTodo(item.id)}
                            >
                              <DeleteSvg/>
                            </a>
                            <Link
                              className="ml-2 cursor-pointer border-2 border-green-500 rounded-md p-1 hover:bg-green-500 hover:text-white"
                              href={`/edit/${item.id}`}
                              // onClick={handleUpdate}
                            >
                              <EditSvg/>
                            </Link>
                            <button
                              type="button"
                              className="ml-2 py-2 text-base cursor-pointer border-2 border-green-500 rounded-md p-1 hover:bg-green-500 hover:text-white text-center"
                              onClick={() => handleOpen(item)}
                              aria-label="Share Todo"
                            >
                              <FaShareAlt />
                            </button>
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </section>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <h2 id="modal-modal-title" className="text-center">
            <span className="font-bold px-1">Title - </span>
            {selectedTodo ? selectedTodo.title : "No Title Found..."}
          </h2>
          <p id="modal-modal-description" className="text-center">
            <span className="font-bold px-1">Description -</span>
            {selectedTodo
              ? selectedTodo.description
              : "No Description Found..."}
          </p>
          <FormControl sx={{ m: 2, width: 300 }}>
            <InputLabel id="demo-multiple-chip-label">Share With</InputLabel>
            <Select
              labelId="demo-multiple-chip-label"
              id="demo-multiple-chip"
              multiple
              value={selectedUserIds}
              onChange={(e) =>handleChangeSelectedUserIds(e, setSelectedUserIds)}
              input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {names.map((name) => (
                <MenuItem
                  key={name.id}
                  value={name.id}
                  style={getStyles(name.id, selectedUserIds, theme)}
                >
                  {name.id} {name.userName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 2, width: 300 }}>
            <InputLabel id="demo-multiple-permission-label">
              Permissions
            </InputLabel>
            <Select
              labelId="demo-multiple-permission-label"
              id="demo-multiple-permission"
              multiple
              value={permissions}
              onChange={(e) =>handleChangePermissions(e,setPermissions)}
              input={
                <OutlinedInput
                  id="select-multiple-permission"
                  label="Permissions"
                />
              }
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((value) => (
                    <Chip key={value} label={value} />
                  ))}
                </Box>
              )}
              MenuProps={MenuProps}
            >
              {permissionOptions.map((permission) => (
                <MenuItem key={permission} value={permission}>
                  {permission}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            onClick={handleShareAndClose}
            variant="contained"
            color="primary"
            sx={{ m: 1 }}
          >
            Share
          </Button>
          <Button
            onClick={handleRemovePermissionsAndClose}
            variant="contained"
            color="secondary"
            sx={{ m: 1 }}
          >
            Remove Permissions
          </Button>
        </Box>
      </Modal>
      <ToastConfig />
    </>
  );
};

export default withAuth(ViewTodos);
// export default ViewTodos;