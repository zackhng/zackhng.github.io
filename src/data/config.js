// Site-wide configurable values.
// The LeetCode username can be overridden at build time:
//   NEXT_PUBLIC_LEETCODE_USERNAME=<name> npm run build
export const LEETCODE_USERNAME =
    process.env.NEXT_PUBLIC_LEETCODE_USERNAME || "zhaohui638";

// Shown when the stats source doesn't expose the avatar URL (the public
// fallback APIs don't). Re-download from leetcode.com if you change your
// profile picture: public/images/leetcode_avatar.png
export const LEETCODE_AVATAR_FALLBACK = "/images/leetcode_avatar.png";
