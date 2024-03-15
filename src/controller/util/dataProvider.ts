export function* makeUserKey() {
    const etcKeys = [
        "0xd677e3fa7a85e1001cbe23e520b0d7df4d0ea6282aca91262abea37e11467905",
        "0x40e386413e3b0dcf998aec42664d02888304f312eb3eb8344d79cfb885d950a9",
        "0xe5196789a665724c1e3f4ed5a46719a7ee953480592dbcc28e0b1fb8c429b569",
        "0xfedd536bffd5fb44ef8e4fb9e4273aa3b467b7496823d92cf6f5adf46b4d39b3",
    ];
    let index = 0;
    while (true) {
        yield etcKeys[index];
        index = (index + 1) % etcKeys.length;
    }
}