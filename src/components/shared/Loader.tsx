const Loader = ({ option = "default" }) => {
  if (option === "default")
    return (
      <img src="/assets/icons/loader.svg" alt="loader" width={24} height={24} />
    );
  if (option === "full")
    return (
      <div className="flex-center h-full w-full">
        <img
          src="/assets/icons/loader.svg"
          alt="loader"
          width={24}
          height={24}
        />
      </div>
    );
};
// const Loader = () => {
//   return (
//     <div className="flex-center w-full">
//       <img src="/assets/icons/loader.svg" alt="loader" width={24} height={24} />
//     </div>
//   );
// };

export default Loader;
